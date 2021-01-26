import React, { useEffect, useReducer, useState } from 'react'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'

import './ModalUpgrade.scss'

// Import components and methods
import ProgressBar from '../ProgressBar/ProgressBar'
import Swal from 'sweetalert2'
import validator from 'validator'
import Modal from '../Modal/Modal'
import {
    Petition,
    getWallets,
    copyData,
    calculateCryptoPrice,
    calculateCryptoPriceWithoutFee,
    WithDecimals,
    amountMin,
} from '../../utils/constanst'

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
    hash: '',

    // Estado que guarda el correo de transaccion Airtm
    emailAirtm: '',

    // Estado que guarda el monto seleccionado por el usuario
    plan: 0,

    // Estado que captura la entrada del usuario en el campo del monto de inversión
    userInput: '',

    // Estado que guarda los montos servidos del backend
    list: [],

    // Estado que guarda la informacion de la coinmarketcap
    cryptoPrices: { BTC: null, ETH: null },

    // Estado para mostrar el valor en dólares la inversión
    amountDollar: 0,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload,
    }
}

/**
 * @param {String} type - Tipo de moneda a procesar
 * @param {Number} amount - Monto inicial de la moneda en el plan
 * @param {Number} amountToday - Monto de la moneda en plan al día actual
 * @param {Number} idInvestment - Código del plan de inversión
 * @param {Function} closeModal - Funcion que cierra el modal
 */

const ModalUpgrade = ({
    type = 'btc',
    amount = 0.5,
    amountToday = 2,
    idInvestment = 0,
    disabled,
    closeModal,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [wallets, setWallets] = useState({})

    /**Constante que define el precio de moneda seleccionada */
    const cryptoPrice =
        state.cryptoPrices.BTC !== null
            ? type.toLowerCase() === 'btc'
                ? state.cryptoPrices.BTC.quote.USD.price
                : state.cryptoPrices.ETH.quote.USD.price
            : 0

    const valuePorcent = (amountToday / (amount * 2)) * 100

    /**
     * Metodo que se ejecuta cuando el usuario quiere hacer Upgrade
     * */
    const onUpgrade = () => {
        const id_currency = type === 'btc' ? 1 : type === 'eth' ? 2 : 0

        Petition.get(`/collection/investment-plan/${id_currency}`).then(
            ({ data }) => {
                if (data) {
                    dispatch({ type: 'list', payload: data })
                } else {
                    Swal.fire(
                        'Ha ocurrido un error',
                        'No se ha podido cargar alguna infomacion, recargue de nuevo o contacte a soporte',
                        'error'
                    )
                }
            }
        )
    }

    /**
     * Metodo que se ejecuta cuando el usuario ejecuta una solicitud de upgrade
     */
    const UpGradeExecute = async () => {
        try {
            dispatch({ type: 'loader', payload: true })

            // Validamos que si el usuario ha seleccionado un plan
            if (state.plan === 0) {
                throw String('Seleccione un plan de inversion')
            }

            // Verifica si el monto de inversión es menor al mínimo
            const checker =
                type === 'btc'
                    ? !(state.plan >= amountMin.btc)
                    : !(state.plan >= amountMin.eth)

            if (checker) {
                throw String(
                    'Ingrese un plan de inversión mayor o igual al mínimo permitido'
                )
            }

            // Validamos el correo AIRTM
            if (state.airtm && !validator.isEmail(state.emailAirtm)) {
                throw String('Ingrese un correo de transacción valido')
            }

            // Validamos el hash de transaccion/id de manipulacion
            if (state.hash.length < 8) {
                // validamos si es Airtmm
                if (state.airtm) {
                    throw String('Id de manipulacion Airtm Incorrecto')
                } else {
                    throw String('Hash de transacción Incorrecto')
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

            await Petition.post('/buy/upgrade', dataSend)
                .then(({ data }) => {
                    if (data.error) {
                        throw String(data.message)
                    } else {
                        // success Upgrade
                        closeModal()

                        dispatch({ type: 'hash', payload: '' })
                        dispatch({ type: 'airtm', payload: false })
                        dispatch({ type: 'alypay', payload: false })
                        dispatch({ type: 'emailAirtm', payload: '' })
                        dispatch({ type: 'userInput', payload: '' })
                        dispatch({ type: 'plan', payload: 0 })

                        closeModal()

                        Swal.fire(
                            'Upgrade Completado',
                            'En breves momentos, estaremos atendiendo su peticion de UPGRADE',
                            'success'
                        )
                    }
                })
                .catch(reason => {
                    throw String(reason.toString())
                })
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error, 'warning')
        } finally {
            dispatch({ type: 'loader', payload: false })
        }
    }

    /**Metodo que se ejecuta cuando el usuario cambia el plan de inversion */
    const onChangePrice = e => {
        let { value } = e.target

        // Expresiones regulares para comprobar que la entrada del monto sea válida
        const floatRegex = /^(?:\d{1,})(?:\.\d{1,})?$/
        const floatRegexStart = /^(?:\d{1,})(?:\.)?$/

        // Verificamos si valor ingresado no contiene letras o símbolos no permitidos
        if (
            !value.length ||
            floatRegex.test(value) ||
            floatRegexStart.test(value)
        ) {
            dispatch({ type: 'userInput', payload: value })

            value = value.length ? value : '0'
            let _amountDollar = 0

            // Verificamos si el usuario pagara con transaccion Airtm
            if (state.airtm) {
                // Sacamos el monto (USD) aproximado en el momento
                _amountDollar = calculateCryptoPrice(
                    cryptoPrice,
                    parseFloat(value)
                )

                dispatch({
                    type: 'aproximateAmount',
                    payload: parseFloat(_amountDollar),
                })
                dispatch({ type: 'plan', payload: parseFloat(value) })
            } else {
                // Se calcula el monto en dolares sin impuestos de la inversión
                _amountDollar = calculateCryptoPriceWithoutFee(
                    cryptoPrice,
                    parseFloat(value)
                )
                dispatch({ type: 'plan', payload: parseFloat(value) })
            }

            dispatch({ type: 'amountDollar', payload: _amountDollar })
        }
    }

    /**Metodo que se ejecuta cuando el usuario cambia el método de pago */
    const onChangePaidMethod = e => {
        const { value } = e.target

        switch (value) {
            case '0':
                dispatch({ type: 'airtm', payload: false })
                dispatch({ type: 'alypay', payload: false })
                break

            case '1':
                dispatch({ type: 'airtm', payload: true })
                dispatch({ type: 'alypay', payload: false })
                break

            case '2':
                dispatch({ type: 'airtm', payload: false })
                dispatch({ type: 'alypay', payload: true })
                break

            default:
                break
        }
    }

    /**
     * Obtiene los precios de la coinmarketcap
     * */
    const getAllPrices = async () => {
        dispatch({ type: 'loaderCoinmarketCap', payload: true })

        const { data } = await Petition.get('/collection/prices')

        if (data.error) {
            Swal.fire('Ha ocurrido un error', data.message, 'error')
        } else {
            const { BTC, ETH } = data

            dispatch({ type: 'cryptoPrices', payload: { BTC, ETH } })
        }

        dispatch({ type: 'loaderCoinmarketCap', payload: false })
    }

    // Obtiene las direcciones de las wallets
    useEffect(() => {
        getWallets(setWallets)
    }, [])

    // Se cargan los precios de las monedas y se reinician los valores de los montos
    useEffect(() => {
        getAllPrices()

        dispatch({ type: 'plan', payload: 0 })
        dispatch({ type: 'userInput', payload: '' })
        dispatch({ type: 'aproximateAmount', payload: 0 })
    }, [state.airtm])

    return (
        <Modal persist={true} onlyChildren>
            <div className="overlay">
                <div className="modal__window modal__upgrade">
                    {!state.loader && (
                        <CloseIcon
                            className="modal__close icon-color"
                            fill="#ffffff"
                            onClick={closeModal}
                        />
                    )}

                    <div className="form__container">
                        <h2
                            className={`${
                                type === 'btc'
                                    ? 'modal__title mt'
                                    : 'modal__title skyblue mt'
                            }`}
                        >
                            Invierte mas en tu plan - {type.toUpperCase()}
                        </h2>

                        <div className="modal__group">
                            <span className="label white">
                                Toca para copiar wallet
                            </span>

                            {
                                // Se cargan as direcciones de las wallets
                                !state.airtm && (
                                    <span
                                        className={`${
                                            type === 'btc'
                                                ? 'wallet'
                                                : 'wallet skyblue'
                                        }`}
                                        onClick={_ =>
                                            copyData(
                                                !state.alypay
                                                    ? wallets[type]
                                                    : wallets.alypay[type]
                                            )
                                        }
                                    >
                                        {!state.alypay
                                            ? wallets[type]
                                            : wallets.alypay[type]}
                                    </span>
                                )
                            }

                            {
                                // Si el método de pago es de Airtm, se carga la dirección del correo
                                state.airtm && (
                                    <span
                                        className={`${
                                            type === 'btc'
                                                ? 'wallet'
                                                : 'wallet skyblue'
                                        }`}
                                        onClick={_ => copyData(wallets.airtm)}
                                    >
                                        {wallets.airtm}
                                    </span>
                                )
                            }
                        </div>

                        <div className="modal__group">
                            {/** Campo para ingresar el monto del upgrade */}
                            <span className="label white">
                                Ingresa el monto de inversion
                            </span>
                            <input
                                disabled={state.loaderCoinmarketCap}
                                value={state.userInput}
                                type="text"
                                onChange={onChangePrice}
                                className="text-input"
                            />

                            <p className="caption">
                                Monto mínimo de inversión: {amountMin[type]}{' '}
                                {type.toUpperCase()}
                            </p>
                            <p className="caption">
                                Monto inversión (USD): ${' '}
                                {WithDecimals(state.amountDollar)}
                            </p>
                        </div>

                        {/** Campo para indicar el método de pago */}
                        <div className="modal__group">
                            <span htmlFor="check-airtm" className="label white">
                                Seleccione su método de pago
                            </span>
                            <select
                                className="picker"
                                onChange={onChangePaidMethod}
                            >
                                <option value={0}>Criptomoneda</option>
                                <option value={1}>Airtm</option>
                                <option value={2}>AlyPay</option>
                            </select>
                        </div>

                        {/** Campo donde se carga la dirección de la billetera */}
                        <div className="modal__group">
                            {state.airtm ? (
                                <span className="label white">
                                    Id de manipulacion Airtm
                                </span>
                            ) : (
                                <span className="label white">
                                    Ingresa el hash de la transaccion
                                </span>
                            )}

                            <input
                                type="text"
                                value={state.hash}
                                onChange={e =>
                                    dispatch({
                                        type: 'hash',
                                        payload: e.target.value,
                                    })
                                }
                                className="text-input"
                            />
                        </div>

                        {
                            // Cuando está seleccionado Airtm, se habilita el campo para ingresar el correo de transacción
                            state.airtm && (
                                <div className="modal__group">
                                    <span className="label white">
                                        Correo de transaccion Airtm
                                    </span>

                                    <input
                                        type="text"
                                        value={state.emailAirtm}
                                        onChange={e =>
                                            dispatch({
                                                type: 'emailAirtm',
                                                payload: e.target.value,
                                            })
                                        }
                                        className="text-input"
                                    />
                                </div>
                            )
                        }

                        <div className="modal__group">
                            <button
                                className="button secondary"
                                className={`${
                                    type === 'btc'
                                        ? 'button secondary'
                                        : 'button skyblue'
                                }`}
                                disabled={state.loader}
                                onClick={UpGradeExecute}
                            >
                                UPGRADE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalUpgrade
