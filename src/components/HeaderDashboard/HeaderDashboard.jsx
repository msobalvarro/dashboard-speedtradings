import React, { useEffect, useReducer, useState } from "react"
import { useSelector } from "react-redux"

// Import styles
import "./HeaderDashboard.scss"

// Import Assets
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import components and methods
import ProgressBar from "../ProgressBar/ProgressBar"
import Swal from "sweetalert2"
import validator from "validator"
import { Petition, getWallets, copyData, calculateCryptoPrice, calculateCryptoPriceWithoutFee, WithDecimals, amountMin } from "../../utils/constanst"

const images = {
    btc: LogoBTC,
    eth: LogoETH,
}

const initialState = {
    // Estado que indica si el usuario hara su transaccion con airtm
    airtm: false,

    // Estado que indica si el usuario hara su transaccion con alypay
    alypay: false,

    // Estado que inica el proceso de traer precios de la coinmarketcao
    loaderCoinmarketCap: false,

    // Estado que guarda el monto aproximado del momento cuando el usuario
    // Paga con montos de Airtm (USD)
    aproximateAmount: 0,

    // Estado que indica si se muestra el loader
    loader: false,

    // Estado que guarda el hash de transaccion o Numero de transaccion Airtm
    hash: "",

    // Estado que guarda el correo de transaccion Airtm
    emailAirtm: "",

    // Estado que guarda el monto seleccionado por el usuario
    plan: 0,

    // Estado que captura la entrada del usuario en el campo del monto de inversión
    userInput: '',

    // Estado que guarda los montos servidos del backend
    list: [],

    // Estado que guarda la presencia de la modal de upgrade
    showModal: false,

    // Estado que guarda la informacion de la coinmarketcap
    cryptoPrices: { BTC: null, ETH: null },

    // Estado para mostrar el valor en dólares la inversión
    amountDollar: 0

}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}


const HeaderDashboard = ({ type = "btc", amount = 0.5, amountToday = 2, idInvestment = 0, disabled = false }) => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)

    const [state, dispatch] = useReducer(reducer, initialState)
    const [wallets, setWallets] = useState({})

    /**Constante que define el precio de moneda seleccionada */
    const cryptoPrice = state.cryptoPrices.BTC !== null
        ? type.toLocaleLowerCase() === "btc"
            ? state.cryptoPrices.BTC.quote.USD.price
            : state.cryptoPrices.ETH.quote.USD.price
        : 0

    const valuePorcent = amountToday / (amount * 2) * 100

    /**Metodo que active/desactiva ventana modal de upgrade */
    const toggleModal = () => {
        if (state.showModal === false) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        // setShowModal(!showModal)
        dispatch({ type: "showModal", payload: !state.showModal })
    }

    /**
     * Metodo que se ejecuta cuando el usuario quiere hacer Upgrade
     * */
    const onUpgrade = () => {
        toggleModal()

        const id_currency = type === 'btc' ? 1 : type === 'eth' ? 2 : 0

        if (state.showModal === false) {
            Petition.get(`/collection/investment-plan/${id_currency}`)
                .then(({ data }) => {
                    if (data) {
                        dispatch({ type: "list", payload: data })
                    } else {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'No se ha podido cargar alguna infomacion, recargue de nuevo o contacte a soporte',
                            'error'
                        )
                    }
                })
        }

    }

    /**
     * Metodo que se ejecuta cuando el usuario ejecuta una solicitud de upgrade
     */
    const UpGradeExecute = async () => {
        try {
            dispatch({ type: "loader", payload: true })

            // Validamos que si el usuario ha seleccionado un plan
            if (state.plan === 0) {
                throw String('Seleccione un plan de inversion')
            }

            // Verifica si el monto de inversión es menor al mínimo
            const checker = (type === 'btc') ? !(state.plan >= amountMin.btc) : !(state.plan >= amountMin.eth)

            if (checker) {
                throw String("Ingrese un plan de inversión mayor o igual al mínimo permitido")
            }

            // Validamos el correo AIRTM 
            if (state.airtm && !validator.isEmail(state.emailAirtm)) {
                throw String("Ingrese un correo de transacción valido")
            }


            // Validamos el hash de transaccion/id de manipulacion
            if (state.hash.length < 8) {
                // validamos si es Airtmm
                if (state.airtm) {
                    throw String("Id de manipulacion Airtm Incorrecto")
                } else {
                    throw String("Hash de transacción Incorrecto")
                }
            }

            const dataSend = {
                airtm: state.airtm,
                alypay: state.alypay,
                emailAirtm: state.emailAirtm,
                aproximateAmountAirtm: state.aproximateAmount,
                amount: state.plan,
                id: idInvestment,
                hash: state.hash,
            }

            await Petition.post('/buy/upgrade', dataSend, {
                headers: {
                    "x-auth-token": token
                }
            }).then(({ data }) => {
                if (data.error) {
                    throw String(data.message)
                } else {
                    // success Upgrade
                    toggleModal()

                    dispatch({ type: "hash", payload: "" })
                    dispatch({ type: "airtm", payload: false })
                    dispatch({ type: "alypay", payload: false })
                    dispatch({ type: "emailAirtm", payload: "" })
                    dispatch({ type: "userInput", payload: "" })
                    dispatch({ type: "plan", payload: 0 })

                    Swal.fire(
                        'Upgrade Completado',
                        'En breves momentos, estaremos atendiendo su peticion de UPGRADE',
                        'success'
                    )
                }
            }).catch(reason => {
                throw String(reason.toString())
            })
        } catch (error) {

            Swal.fire(
                'Ha ocurrido un error',
                error,
                'warning'
            )
        } finally {
            dispatch({ type: "loader", payload: false })
        }
    }

    /**Metodo que se ejecuta cuando el usuario cambia el plan de inversion */
    const onChangePrice = (e) => {
        let { value } = e.target

        // Expresiones regulares para comprobar que la entrada del monto sea válida
        const floatRegex = /^(?:\d{1,})(?:\.\d{1,})?$/
        const floatRegexStart = /^(?:\d{1,})(?:\.)?$/

        // Verificamos si valor ingresado no contiene letras o símbolos no permitidos
        if (!value.length || floatRegex.test(value) || floatRegexStart.test(value)) {
            dispatch({ type: "userInput", payload: value })

            value = (value.length) ? value : '0'
            let _amountDollar = 0

            // Verificamos si el usuario pagara con transaccion Airtm
            if (state.airtm) {
                // Sacamos el monto (USD) aproximado en el momento
                _amountDollar = calculateCryptoPrice(cryptoPrice, parseFloat(value))

                dispatch({ type: "aproximateAmount", payload: parseFloat(_amountDollar) })
                dispatch({ type: "plan", payload: parseFloat(value) })
            } else {
                // Se calcula el monto en dolares sin impuestos de la inversión
                _amountDollar = calculateCryptoPriceWithoutFee(cryptoPrice, parseFloat(value))
                dispatch({ type: "plan", payload: parseFloat(value) })
            }

            dispatch({ type: 'amountDollar', payload: _amountDollar })
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

        const { data } = await Petition.get("/collection/prices")

        if (data.error) {
            Swal.fire("Ha ocurrido un error", data.message, "error")
        } else {
            const { BTC, ETH } = data

            dispatch({ type: "cryptoPrices", payload: { BTC, ETH } })
        }

        dispatch({ type: "loaderCoinmarketCap", payload: false })
    }

    useEffect(() => {
        getWallets(setWallets)
    }, [])

    useEffect(() => {
        if (state.showModal) {
            getAllPrices()

        }

        dispatch({ type: "plan", payload: 0 })
        dispatch({ type: "userInput", payload: '' })
        dispatch({ type: "aproximateAmount", payload: 0 })
    }, [state.showModal, state.airtm])

    return (
        <>
            <div className="container-info-crypto">
                <img src={images[type]} className="crypto" alt="crypto" />

                <div className="info">
                    <div className="row-header">
                        <h1>{amount} {type.toUpperCase()}</h1>

                        <button className="button secondary" onClick={onUpgrade} disabled={disabled}>Upgrade</button>
                    </div>

                    <div className="row-header progress">
                        {/* Progress bar */}
                        <ProgressBar value={valuePorcent} legend={`Ganado (${valuePorcent.toFixed(1)}%)`} />

                        {
                            valuePorcent < 40 &&
                            <span className="value-legend">{`Ganado (${valuePorcent.toFixed(1)}%)`}</span>
                        }
                    </div>
                </div>
            </div>


            {
                state.showModal &&
                <div className="modal-upgrade">
                    <div className="content">

                        <div className="m-header">
                            <h2>Invierte mas en tu plan - {type.toUpperCase()}</h2>

                            <div className="col-wallet">
                                {
                                    !state.airtm &&
                                    <span
                                        className="wallet"
                                        onClick={_ => copyData(!state.alypay ? wallets[type] : wallets.alypay[type])}>
                                        {
                                            !state.alypay

                                                ? wallets[type]

                                                : wallets.alypay[type]
                                        }
                                    </span>
                                }

                                {
                                    state.airtm &&
                                    <span className="wallet" onClick={_ => copyData(wallets.airtm)}>
                                        {
                                            wallets.airtm
                                        }
                                    </span>
                                }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <span>Ingresa el monto de inversion</span>
                                <input
                                    disabled={state.loaderCoinmarketCap}
                                    value={state.userInput}
                                    type="text"
                                    onChange={onChangePrice}
                                    className="text-input" />


                                <div className="aproximateAmount-legend">
                                    <p>Monto mínimo de inversión: {amountMin[type]} {type.toUpperCase()}</p>
                                    <p>
                                        Monto inversión (USD): $ {WithDecimals(state.amountDollar)}
                                    </p>
                                </div>
                            </div>

                            <div className="col">

                                {
                                    state.airtm
                                        ? <span>Id de manipulacion Airtm</span>
                                        : <span>Ingresa el hash de la transaccion</span>
                                }

                                <input
                                    type="text"
                                    value={state.hash}
                                    onChange={e => dispatch({ type: "hash", payload: e.target.value })}
                                    className="text-input" />
                            </div>
                        </div>

                        {
                            state.airtm &&
                            <div className="row flex-end">
                                <div className="col">

                                    <span>Correo de transaccion Airtm</span>

                                    <input
                                        type="text"
                                        value={state.emailAirtm}
                                        onChange={e => dispatch({ type: "emailAirtm", payload: e.target.value })}
                                        className="text-input" />
                                </div>
                            </div>
                        }

                        <div className="footer-modal">
                            <div className="airtm-row">
                                <span htmlFor="check-airtm">Seleccione su método de pago</span>
                                <select className="picker" onChange={onChangePaidMethod}>
                                    <option value={0}>Criptomoneda</option>
                                    <option value={1}>Airtm</option>
                                    <option value={2}>AlyPay</option>
                                </select>
                            </div>

                            <div className="buttons">
                                <button className="button" disabled={state.loader} onClick={toggleModal}>Cancelar</button>
                                <button className="button secondary" disabled={state.loader} onClick={UpGradeExecute}>UPGRADE</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default HeaderDashboard