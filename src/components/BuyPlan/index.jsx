import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import Modal from '../Modal/Modal'
import './styles.scss'

// Import Assets
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-big.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum-big.svg'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'

// Import info or components
import validator from 'validator'
import {
  Petition,
  getWallets,
  copyData,
  WithDecimals,
  calculateCryptoPrice,
  calculateCryptoPriceWithoutFee,
  amountMin,
} from '../../utils/constanst'

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
  hash: '',

  // Estado que guarda el correo de transaccion Airtm
  emailAirtm: '',

  // Estado que guarda el valor de select (Plan de inversion / monto de inversion)
  amount: 0,

  // Estado que indica si hay un proceso
  loader: false,

  // Estado que indica el proceso para obtener los precios de coinmarketcap
  loaderCoinmarketCap: false,

  // Estado que almacena los hash de las distintas wallets a usar en  los métodos de pago
  wallets: {},

  amountDollar: 0,
}

const reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  }
}

/**
 * @param {Number} idCrypto - código de la moneda
 * @param {Callback} onBuy - Función a ejecutar cuando se realiza la comprar
 * @param {Function} closeModal - Función para cerrar el modal

 */

const BuyPlan = ({ idCrypto = 1, onBuy = () => {}, closeModal = () => {} }) => {
  // Redux store
  const storage = useSelector(store => store.globalStorage)

  // Estados generales del componente
  const [state, dispatch] = useReducer(reducer, initialState)

  const BITCOIN = { id: 1, name: 'bitcoin' }
  const ETHEREUM = { id: 2, name: 'ethereum' }

  // Symbol de la moneda a partir del idCrypto
  const type = idCrypto === BITCOIN.id ? 'btc' : 'eth'

  /**Constante que define el precio de moneda seleccionada */
  const cryptoPrice =
    state.cryptoPrices.BTC !== null
      ? idCrypto === BITCOIN.id
        ? state.cryptoPrices.BTC.quote.USD.price
        : state.cryptoPrices.ETH.quote.USD.price
      : 0

  /**Metodo que se ejecuta cuando el usuario compra el plan */
  const Buy = async () => {
    dispatch({ type: 'loader', payload: true })

    try {
      // Validamos el hash
      if (state.hash.trim().length < 8) {
        if (state.airtm) {
          throw String('Id de manipulacion Airtm incorrecto')
        } else {
          throw String('Hash incorrecto')
        }
      }

      // Validamos que el monto sea correcto
      if (state.amount === 0) {
        throw String('Seleccion un Plan de inversion')
      }

      // Verifica si el monto de inversión es menor al mínimo
      const checker =
        type === 'btc'
          ? !(state.amount >= amountMin.btc)
          : !(state.amount >= amountMin.eth)

      if (checker) {
        throw String(
          'Ingrese un plan de inversión mayor o igual al mínimo permitido'
        )
      }

      if (state.airtm) {
        if (!validator.isEmail(state.emailAirtm)) {
          throw String('Correo de transacción Airtm incorrecto')
        }

        if (state.aproximateAmount === 0) {
          throw String('No se ha podido calcular el monto, contacte a soporte')
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

      const { data } = await Petition.post('/buy/plan', dataSend)

      if (data.error) {
        throw String(data.message)
      }

      if (data.response === 'success') {
        onBuy()

        Swal.fire(
          'Plan solicitado',
          'En breves momentos estaremos confirmando tu transacción',
          'success'
        )
      }
    } catch (error) {
      Swal.fire('Ha ocurrido un error', error.toString(), 'warning')
    }

    dispatch({ type: 'loader', payload: false })
  }

  /**Metodo que se ejecuta cuando el usuario selecciona el monto de inversion */
  const onChangeAmount = e => {
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
        _amountDollar = calculateCryptoPrice(cryptoPrice, parseFloat(value))

        dispatch({
          type: 'aproximateAmount',
          payload: parseFloat(_amountDollar),
        })
        dispatch({ type: 'amount', payload: parseFloat(value) })
      } else {
        // Se calcula el monto en dolares sin impuestos de la inversión
        _amountDollar = calculateCryptoPriceWithoutFee(
          cryptoPrice,
          parseFloat(value)
        )
        dispatch({ type: 'amount', payload: parseFloat(value) })
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

  /**Obtiene los precios de la coinmarketcap */
  const getAllPrices = async () => {
    dispatch({ type: 'loaderCoinmarketCap', payload: true })

    await Petition.get('/collection/prices').then(response => {
      const { data } = response

      if (data.error) {
        Swal.fire('Ha ocurrido un error', data.message, 'error')
      } else {
        const { BTC, ETH } = data

        dispatch({ type: 'cryptoPrices', payload: { BTC, ETH } })
      }
    })

    dispatch({ type: 'loaderCoinmarketCap', payload: false })
  }

  useEffect(() => {
    // Se obtinen lso diferentes precios de las criptomonedas
    getAllPrices()
    // Se obtiene los hash de las wallets
    getWallets(data => dispatch({ type: 'wallets', payload: data }))

    dispatch({ type: 'amount', payload: 0 })
  }, [])

  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal__buyplan modal__window">
          <div className="modal__close">
            <CloseIcon className="icon" fill="#ffffff" onClick={closeModal} />
          </div>

          <div className="form__container">
            <div className="modal__icon--container">
              {idCrypto === 1 && (
                <>
                  <BitcoinIcon className="plan__icon icon" color="#ffcb08" />

                  <h2 className="modal__title">Adquirir plan de Bitcoin</h2>
                </>
              )}

              {idCrypto === 2 && (
                <>
                  <EthereumIcon className="plan__icon icon" color="#9ed3da" />
                  <h2
                    className={`${
                      idCrypto === BITCOIN.id
                        ? 'modal__title'
                        : 'modal__title skyblue'
                    }`}
                  >
                    Adquirir plan de Ethereum
                  </h2>
                </>
              )}
            </div>
            <div className="modal__group">
              {!state.airtm && (
                <>
                  {/** Se cargan las wallets según la moneda en que se realizará el pago del plan */}
                  <span className="label white">Toca para copiar wallet</span>
                  <span
                    className={`${
                      idCrypto === BITCOIN.id ? 'wallet' : 'wallet skyblue'
                    }`}
                    onClick={_ =>
                      copyData(
                        !state.alypay
                          ? state.wallets[type]
                          : state.wallets.alypay[type]
                      )
                    }
                  >
                    {!state.alypay
                      ? state.wallets[type]
                      : state.wallets.alypay[type]}
                  </span>
                </>
              )}

              {state.airtm && (
                <>
                  {/** Si el pago se realizará el Airtm, se carga el correo electrónico donde se realizará el depósito */}
                  <span className="label white">
                    Toca para copiar cuenta Airtm
                  </span>
                  <span
                    className={`${
                      idCrypto === BITCOIN.id ? 'wallet' : 'wallet skyblue'
                    }`}
                    onClick={_ => copyData(state.wallets.airtm)}
                  >
                    {state.wallets.airtm}
                  </span>
                </>
              )}
            </div>

            <div className="modal__group">
              {/** Se establece el método de pago */}
              <span className="label white" htmlFor="check-airtm">
                Seleccione su método de pago
              </span>
              <select
                className="value"
                className="picker"
                onChange={onChangePaidMethod}
              >
                <option value={0}>Criptomoneda</option>
                <option value={1}>Airtm</option>
                <option value={2}>AlyPay</option>
              </select>
            </div>

            <div className="modal__group">
              {/** Campo para ingresar el monto del plan a adquirir */}
              <span className="label white">Ingresa el monto de inversion</span>
              <input
                disabled={state.loaderCoinmarketCap}
                value={state.userInput}
                type="text"
                onChange={onChangeAmount}
                className="text-input"
              />

              <div className="aproximateAmount-legend">
                <p className="caption">
                  Monto mínimo de inversión: {amountMin[type]}{' '}
                  {type.toUpperCase()}
                </p>
                <p className="caption">
                  Monto inversión (USD): ${WithDecimals(state.amountDollar)}
                </p>
              </div>
            </div>

            <div className="modal__group">
              {state.airtm ? (
                <span className="label white">Id de manipulacion Airtm</span>
              ) : (
                <span className="label white">
                  Escribe el hash de transacción
                </span>
              )}
              {/** Campo para ingresar de dónde van a provenir los fondos */}
              <input
                value={state.hash}
                onChange={e =>
                  dispatch({ type: 'hash', payload: e.target.value })
                }
                type="text"
                className="text-input"
              />
            </div>

            {state.airtm && (
              <div className="modal__group">
                <span className="label white">Correo de transacción Airtm</span>

                <input
                  value={state.emailAirtm}
                  onChange={e =>
                    dispatch({ type: 'emailAirtm', payload: e.target.value })
                  }
                  type="email"
                  className="text-input"
                />
              </div>
            )}
            <div className="modal__group">
              <button
                disabled={state.loader}
                className={`${
                  idCrypto === BITCOIN.id
                    ? 'button secondary large'
                    : 'button skyblue large'
                }`}
                onClick={Buy}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BuyPlan
