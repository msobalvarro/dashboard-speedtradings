import React, { useEffect, useReducer } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import validator from "validator"
import { Petition, getWallets, copyData, WithDecimals, calculateCryptoPrice, calculateCryptoPriceWithoutFee, amountMin } from "../../utils/constanst"

const initialState = {
    // Estado que indica si la transacción es con airtm
    airtm: false,

    // Estado que indica si la transacción es en con alypay
    alypay: false,

    // Estado que captura la entrada del usuario en el monto de inversión
    userInput: '',

    // Estado que guarda la informacion de la coinmarketcap
    cryptoPrices: { BTC: null, ETH: null },

    // Estado que guarda el monto aproximado del momento cuando el usuario
    // Paga con montos de Airtm (USD)
    aproximateAmount: 0,

    // Estado que guardara los planes
    plans: [],

    // Estado que guarda el hash de transacción
    hash: "",

    // Estado que guarda el correo de transaccion Airtm
    emailAirtm: "",

    // Estado que guarda el valor de select (Plan de inversion / monto de inversion)
    amount: 0,

    // Estado que indica si hay un proceso
    loader: false,

    // Estado que indica el proceso para obtener los precios de coinmarketcap
    loaderCoinmarketCap: false,

    // Estado que almacena los hash de las distintas wallets a usar en  los métodos de pago
    wallets: {}
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const BuyPlan = ({ idCrypto = 1, onBuy = () => { } }) => {
    // Redux store
    const storage = useSelector(store => store.globalStorage)

    // Estados generales del componente
    const [state, dispatch] = useReducer(reducer, initialState)

    // Symbol de la moneda a partir del idCrypto
    const type = (idCrypto === 1) ? 'btc' : 'eth'

    /**Constante que define el precio de moneda seleccionada */
    const cryptoPrice = state.cryptoPrices.BTC !== null
        ? idCrypto === 1
            ? state.cryptoPrices.BTC.quote.USD.price
            : state.cryptoPrices.ETH.quote.USD.price
        : 0

    /**Metodo que se ejecuta cuando el usuario compra el plan */
    const Buy = async () => {
        dispatch({ type: "loader", payload: true })

        try {
            // Validamos el hash
            if (state.hash.trim().length < 8) {
                if (state.airtm) {
                    throw 'Id de manipulacion Airtm incorrecto'
                } else {
                    throw 'Hash incorrecto'
                }
            }

            // Validamos que el monto sea correcto
            if (state.amount === 0) {
                throw "Seleccion un Plan de inversion"
            }

            if ((type === 'btc' && state.amount < amountMin.btc) || (type === 'eth' && state.amount < amountMin.eth)) {
                throw String("Por favor ingrese un plan de inversión mayor o igual al mínimo permitido")
            }

            if (state.airtm) {
                if (!validator.isEmail(state.emailAirtm)) {
                    throw "Correo de transacción Airtm incorrecto"
                }

                if (state.aproximateAmount === 0) {
                    throw "No se ha podido calcular el monto, contacte a soporte"
                }
            }

            // Armamos los datos a enviar al backend
            const dataSend = {
                airtm: state.airtm,
                alypay: state.alypay,
                emailAirtm: state.emailAirtm,
                aproximateAmountAirtm: state.aproximateAmount,
                id_currency: idCrypto,
                id_user: storage.id_user,
                hash: state.hash,
                amount: parseFloat(state.amount),
            }

            const { data } = await Petition.post('/buy/plan', dataSend, { headers: { "x-auth-token": storage.token } })

            if (data.error) {
                throw String(data.message)
            }

            if (data.response === "success") {
                onBuy()

                Swal.fire(
                    "Plan solicitado",
                    "En breves momentos estaremos confirmando tu transacción",
                    "success"
                )
            }

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        }


        dispatch({ type: "loader", payload: false })
    }

    /**Metodo que se ejecuta cuando el usuario selecciona el monto de inversion */
    const onChangeAmount = (e) => {
        let { value } = e.target

        // Expresiones regulares para comprobar que la entrada del monto sea válida
        const floatRegex = /^(?:\d{1,})(?:\.\d{1,})?$/
        const floatRegexStart = /^(?:\d{1,})(?:\.)?$/

        // Verificamos si valor ingresado no contiene letras o símbolos no permitidos
        if (!value.length || floatRegex.test(value) || floatRegexStart.test(value)) {
            dispatch({ type: "userInput", payload: value })

            value = (value.length) ? value : '0'

            // Verificamos si el usuario pagara con transaccion Airtm
            if (state.airtm) {
                // Sacamos el monto (USD) aproximado en el momento
                const amount = calculateCryptoPrice(cryptoPrice, parseFloat(value))
                dispatch({ type: "aproximateAmount", payload: parseFloat(amount) })
            } else {
                // Se calcula el monto en dolares sin impuestos de la inversión
                const amount = calculateCryptoPriceWithoutFee(cryptoPrice, parseFloat(value))
                dispatch({ type: "amount", payload: parseFloat(amount) })
            }
        }
    }

    /**Metodo que se ejecuta cuando el usuario cambia el método de pago */
    const onChangePaidMethod = (e) => {
        const { value } = e.target;

        switch (value) {
            case "0":
                dispatch({ type: "airtm", payload: false })
                dispatch({ type: "alypay", payload: false })
                break

            case "1":
                dispatch({ type: "airtm", payload: true })
                dispatch({ type: "alypay", payload: false })
                break

            case "2":
                dispatch({ type: "airtm", payload: false })
                dispatch({ type: "alypay", payload: true })
                break
        }
    }

    /**
     * Obtiene los precios de la coinmarketcap
     * */
    const getAllPrices = async () => {
        dispatch({ type: "loaderCoinmarketCap", payload: true })

        await Petition.get("/collection/prices")
            .then(response => {
                const { data } = response

                if (data.error) {
                    Swal.fire("Ha ocurrido un error", data.message, "error")
                } else {
                    const { BTC, ETH } = data

                    dispatch({ type: "cryptoPrices", payload: { BTC, ETH } })
                }
            })

        dispatch({ type: "loaderCoinmarketCap", payload: false })
    }

    useEffect(() => {
        // Se obtinen lso diferentes precios de las criptomonedas
        getAllPrices()
        // Se obtiene los hash de las wallets
        getWallets((data) => dispatch({ type: 'wallets', payload: data }))

        dispatch({ type: "amount", payload: 0 })
    }, [])


    return (
        <div className="container-buy-plan">

            {
                idCrypto === 1 &&
                <>
                    <img src={LogoBTC} className="logo-crypto" alt="bitcoin" />
                    <h2>Adquirir plan de Bitcoin</h2>
                </>
            }

            {
                idCrypto === 2 &&
                <>
                    <img src={LogoETH} className="logo-crypto" alt="ethereum" />
                    <h2>Adquirir plan de Ethereum</h2>
                </>
            }

            <div className="row wallets">
                {
                    !state.airtm &&
                    <>
                        <span>Toca para copiar wallet</span>
                        <span className="wallet" onClick={_ => copyData(!state.alypay ? state.wallets[type] : state.wallets.alypay[type])}>
                            {
                                !state.alypay
                                ? state.wallets[type]
                                : state.wallets.alypay[type]
                            }
                        </span>
                    </>
                }

                {
                    state.airtm &&
                    <>
                        <span>Toca para copiar cuenta Airtm</span>
                        <span className="wallet" onClick={_ => copyData(state.wallets.airtm)}>{state.wallets.airtm}</span>
                    </>
                }
            </div>

            <div className="row">
                <span htmlFor="check-airtm">Seleccione su método de pago</span>
                <select className="picker" onChange={onChangePaidMethod}>
                    <option value={0}>Depósito</option>
                    <option value={1}>Airtm</option>
                    <option value={2}>AlyPay</option>
                </select>
            </div>

            <div className="row">
                <span>Ingresa el monto de inversion</span>
                <input
                    disabled={state.loaderCoinmarketCap}
                    value={state.userInput}
                    type="text"
                    onChange={onChangeAmount}
                    className="text-input" />


                <div className="aproximateAmount-legend">
                    <p>Monto mínimo de inversión: {amountMin[type]} {type.toUpperCase()}</p>
                    <p>
                        Monto inversión (USD):
                        {
                            !state.airtm
                            ? ` $ ${WithDecimals(state.amount)}`
                            : ` $ ${WithDecimals(state.aproximateAmount)}`                                                
                        }
                    </p>
                </div>
            </div>

            <div className="row">
                {
                    state.airtm
                        ? <span>Id de manipulacion Airtm</span>
                        : <span>Escribe el hash de transacción</span>
                }
                <input
                    value={state.hash}
                    onChange={e => dispatch({ type: "hash", payload: e.target.value })}
                    type="text"
                    className="text-input" />
            </div>

            {
                state.airtm &&
                <div className="row">
                    <span>Correo de transacción Airtm</span>

                    <input
                        value={state.emailAirtm}
                        onChange={e => dispatch({ type: "emailAirtm", payload: e.target.value })}
                        type="email"
                        className="text-input" />
                </div>
            }

            <button disabled={state.loader} className="button secondary large" onClick={Buy}>
                Comprar
            </button>
        </div>
    )
}

export default BuyPlan