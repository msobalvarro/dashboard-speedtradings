import React, { useEffect, useReducer } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import validator from "validator"
import { Petition, wallets, copyData, calculateCryptoPrice } from "../../utils/constanst"

const initialState = {
    // Estado que indica si la transacción es con airtm
    airtm: false,

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

            if (state.airtm) {
                if (!validator.isEmail(state.emailAirtm)) {
                    throw "Correo de transacción Airtm incorrecto"
                }

                if (state.aproximateAmount === 0) {
                    throw "No se ha podido calcular el monto, contacte a soporte"
                }
            }

            // Armamos los datos a enviar al backend
            const data = {
                airtm: state.airtm,
                emailAirtm: state.emailAirtm,
                aproximateAmountAirtm: state.aproximateAmount,
                id_currency: idCrypto,
                id_user: storage.id_user,
                hash: state.hash,
                amount: parseFloat(state.amount),
            }

            await Petition.post('/buy/plan', data, {
                headers: {
                    "x-auth-token": storage.token
                }
            }).then(({ data }) => {
                if (data.response === "success") {
                    onBuy()

                    Swal.fire(
                        "Plan solicitado",
                        "En breves momentos estaremos confirmando tu transacción",
                        "success"
                    )
                }
            })

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        }


        dispatch({ type: "loader", payload: false })
    }

    /**Metodo que se ejecuta cuando el usuario selecciona el monto de inversion */
    const onChangeAmount = (e) => {
        const { value } = e.target

        dispatch({ type: "amount", payload: parseFloat(value) })

        // Verificamos si el usuario pagara con transacción Airtm
        if (state.airtm) {
            // Sacamos el monto (USD) aproximado en el momento
            const amount = calculateCryptoPrice(cryptoPrice, parseFloat(value))

            dispatch({ type: "aproximateAmount", payload: parseFloat(amount) })
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
        if (state.airtm) {
            getAllPrices()
        }

        dispatch({ type: "amount", payload: 0 })
    }, [state.airtm])

    useEffect(() => {
        try {
            // Obtenemos todos los planes de inversion
            Petition.get(`/collection/investment-plan/${idCrypto}`)
                .then(({ data }) => {
                    if (data.error) {
                        throw data.message
                    } else {
                        dispatch({ type: "plans", payload: data })
                    }
                })
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        }
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

                        {
                            idCrypto === 1 &&
                            <span className="wallet" onClick={_ => copyData(wallets.btc)}>{wallets.btc}</span>
                        }

                        {
                            idCrypto === 2 &&
                            <span className="wallet" onClick={_ => copyData(wallets.eth)}>{wallets.eth}</span>
                        }
                    </>
                }

                {
                    state.airtm &&
                    <>
                        <span>Toca para copiar cuenta Airtm</span>
                        <span className="wallet" onClick={_ => copyData(wallets.airtm)}>{wallets.airtm}</span>
                    </>
                }
            </div>

            <div className="row">
                <span>Selecciona tu plan</span>
                <select className="picker" disabled={state.loaderCoinmarketCap} value={state.amount} onChange={onChangeAmount}>
                    <option value={0} disabled>Selecciona un plan</option>
                    {
                        state.airtm &&
                        <>
                            {
                                state.plans.map((item, key) =>
                                    <option key={key} value={item.amount}>
                                        $ {calculateCryptoPrice(cryptoPrice, item.amount)}
                                    </option>
                                )
                            }
                        </>
                    }

                    {
                        !state.airtm &&
                        <>
                            {
                                state.plans.map((item, key) =>
                                    <option key={key} value={item.amount}>
                                        {
                                            idCrypto === 1 &&
                                            item.amount + ' BTC'
                                        }

                                        {
                                            idCrypto === 2 &&
                                            item.amount + ' ETH'
                                        }
                                    </option>
                                )
                            }
                        </>
                    }
                </select>
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

            <div className="row airtm-transaction">
                <label htmlFor="airtm-transaction">transacción con Airtm</label>

                <input
                    type="checkbox"
                    checked={state.airtm}
                    onChange={_ => dispatch({ type: "airtm", payload: !state.airtm })}
                    id="airtm-transaction" />
            </div>

            <button disabled={state.loader} className="button secondary large" onClick={Buy}>
                Comprar
            </button>
        </div>
    )
}

export default BuyPlan