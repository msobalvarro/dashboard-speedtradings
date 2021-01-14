import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
  Petition,
  calculateCryptoPriceWithoutFee,
  copyData,
  floor,
} from '../../utils/constanst'

// Import styles and assets
import astronaut from '../../static/images/astronaut.png'
//Import icons
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-small.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum -small.svg'

import { ReactComponent as CopyIcon } from '../../static/icons/copy.svg'

import './Sponsors.scss'

// Imports components
import Swal from 'sweetalert2'
import '@sweetalert2/theme-dark/dark.scss'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import moment from 'moment'

import { Link } from 'react-router-dom'

const Sponsors = () => {
  const { globalStorage } = useSelector(storage => storage)
  const urlSponsor =
    'https://' + window.location.host + '/#/register/' + globalStorage.username

  // Estado para controlar la visibilidad del indicador de carga
  const [loader, setLoader] = useState(true)

  // Estados para almacenar la información de los planes
  const [data, setData] = useState([])

  const [SumBTC, setSumBTC] = useState(0)
  const [SumETH, setSumETH] = useState(0)

  // Estado para almacenar los precios de las monedas en dólares
  const [cryptoPrices, setCryptoPrices] = useState({ BTC: null, ETH: null })

  // Estado para almacenar el valor de búsqueda para el filtro
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    try {
      setLoader(true)

      Petition.get(`/collection/sponsors/${globalStorage.id_user}`)
        .then(({ data, status }) => {
          if (data.error) {
            throw String(data.message)
          }

          if (data && status === 200) {
            setData(data)
          }
          setLoader(false)
        })
        .catch(reason => {
          throw String(reason)
        })
    } catch (error) {
      Swal.fire(
        'Ha ocurrido un error',
        'Se ha producido un error al cargar los datos, intentelo mas tarde o contacte a soporte',
        'error'
      )

      setLoader(false)
    }
  }, [])

  const sumAmounts = (_data = []) => {
    // sum all comissions
    let _sumBTC = 0
    let _sumETH = 0

    // Suma los montos de las comisiones para cada moneda
    _data.forEach(item => {
      switch (item.id_currency) {
        // Si es Bitcoin
        case 1:
          _sumBTC += item.comission || 0
          break

        // Si es Ethereum
        case 2:
          _sumETH += item.comission || 0
          break

        default:
          break
      }
    })

    setSumBTC(_sumBTC)
    setSumETH(_sumETH)
  }

  /**
   * Obtiene los precios de la coinmarketcap
   * */
  const getAllPrices = async () => {
    await Petition.get('/collection/prices').then(({ data }) => {
      if (data.error) {
        Swal.fire('Ha ocurrido un error', data.message, 'error')
      } else {
        const { BTC, ETH } = data

        setCryptoPrices({ BTC, ETH })
      }
    })
  }

  /**
   * Función que calcula el valor en dolares de la comisión según el tipo de moneda
   * @param {Number} _id_currency - id de la criptomoneda en la que se pago la comisión
   * @param {Number} _amount - Monto de la comisión en criptomoneda
   * @return {Number} - Monto en dolares del comisión recibida en criptomoneda
   */
  const calcDollarAmount = (_id_currency, _amount) => {
    if (cryptoPrices.BTC === null || cryptoPrices.ETH === null) {
      return 0
    }

    /**
     * Se obtiene el valor en dólares de la moneda según su id_current y se calcula
     * el equivalente en dolares del monto recibido
     */
    switch (_id_currency) {
      // Para Bitcoin
      case 1:
        return calculateCryptoPriceWithoutFee(
          cryptoPrices.BTC.quote.USD.price,
          _amount
        )

      // Para Ethereum
      case 2:
        return calculateCryptoPriceWithoutFee(
          cryptoPrices.ETH.quote.USD.price,
          _amount
        )

      default:
        return 0
    }
  }

  // se cargan los precios de las monedas
  useEffect(() => {
    getAllPrices()
  }, [])

  /**
   * Función que realiza el filtro de la lista de comisiones según el valor dentro del
   * input de filtro
   */

  const filteredData = useMemo(() => {
    if (keyword.length === 0) return data

    return data.filter(sponsor => {
      return (
        sponsor.firstname.toLowerCase().includes(keyword.toLowerCase()) ||
        sponsor.lastname.toLowerCase().includes(keyword.toLowerCase()) ||
        sponsor.firstname.toLowerCase().includes(keyword.toLowerCase()) ||
        (sponsor.id_currency === 1 &&
          'bitcoin'.includes(keyword.toLowerCase())) ||
        (sponsor.id_currency === 2 &&
          'ethereum'.includes(keyword.toLowerCase())) ||
        `${sponsor.amount}`.includes(keyword) ||
        `${sponsor.fee_sponsor}`.includes(keyword) ||
        `${sponsor.comission}`.includes(keyword)
      )
    })
  }, [data, keyword])

  useEffect(() => {
    sumAmounts(filteredData)
  }, [filteredData])

  return (
    <>
      <NavigationBar />
      <section className="sponsors">
        <h2 className="sponsors__title">Reporte de comisiones</h2>

        <p className="label white">
          Comparte tu link de referencia, toca para copiar
        </p>
        <div className="link__sponsor--container">
          <p
            className="link__sponsor--text"
            onClick={_ =>
              copyData(
                urlSponsor,
                'Link de referencia copiado, ¡comparte con tus amigos!'
              )
            }
          >
            {urlSponsor}
          </p>
          <button
            className="link__sponsor--button"
            onClick={_ =>
              copyData(
                urlSponsor,
                'Link de referencia copiado, ¡comparte con tus amigos!'
              )
            }
          >
            <CopyIcon className="icon__copy icon" color="#333" />
          </button>
        </div>

        {loader && (
          <div className="center__element">
            <ActivityIndicator size={128} className="loader-sponsors" />
          </div>
        )}

        {data.length === 0 && (
          <div className="empty__comission">
            <img src={astronaut} alt="Empty state" />
            <h2 className="label white">Aún no tiene referidos</h2>
            <Link to="/">
              <button className="button green">Volver al dashboard</button>
            </Link>
          </div>
        )}

        {data.length >= 2 && (
          <div className="search__group">
            <label className="label white" htmlFor="searchComission">
              Buscar comisiones
            </label>
            <input
              id="searchComission"
              type="text"
              className="text-input large"
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
        )}
        {filteredData.length > 0 && (
          <div className="list-of-sponsors">
            {filteredData.map((sponsor, index) => (
              <div className="sponsor__card" key={index}>
                <div className="sponsor__group">
                  <span className="sponsor__label">Referido</span>
                  <p className="sponsor__value name">
                    {sponsor.firstname} {sponsor.lastname}
                  </p>
                </div>

                <div className="three__columns">
                  <div className="sponsor__group">
                    <span className="sponsor__label">Fecha</span>
                    <p className="sponsor__value">
                      {' '}
                      {moment(sponsor.registration_date).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div className="sponsor__group">
                    <span className="sponsor__label">Moneda</span>
                    <div className="sponsor__value">
                      {sponsor.id_currency === 1 ? (
                        <div className="align__vertical">
                          <BitcoinIcon
                            className="sponsor__icon small icon"
                            color="#ffcb08"
                          />
                          Bitcoin
                        </div>
                      ) : (
                        <div className="align__vertical">
                          <EthereumIcon
                            className="sponsor__icon small icon"
                            color="#9ed3da"
                          />
                          Ethereum
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sponsor__group">
                    <span className="sponsor__label">Inversión</span>
                    <p className="sponsor__value">{`${sponsor.amount} ${
                      sponsor.id_currency === 1 ? 'BTC' : 'ETH'
                    }`}</p>
                  </div>
                </div>
                <div className="three__columns">
                  <div className="sponsor__group">
                    <span className="sponsor__label">Ganancia</span>
                    <p className="sponsor__value">
                      {' '}
                      {`${floor(sponsor.comission, 8)} ${
                        sponsor.id_currency === 1 ? 'BTC' : 'ETH'
                      }`}
                    </p>
                  </div>
                  <div className="sponsor__group">
                    <span className="sponsor__label">Porcentaje</span>
                    <p className="sponsor__value">
                      {sponsor.fee_sponsor * 100} %
                    </p>
                  </div>
                  <div className="sponsor__group">
                    <span className="sponsor__label">USD</span>
                    <p className="sponsor__value">
                      ${' '}
                      {calcDollarAmount(sponsor.id_currency, sponsor.comission)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredData.length > 0 && (
          <div className="commissions__total">
            <div className="commissions__total--group">
              <div className="label white align__vertical">
                Total BTC{' '}
                <BitcoinIcon className="sponsor__icon icon" color="#ffcb08" />
              </div>
              <span className="value">
                {floor(SumBTC, 8)} BTC ($
                {calcDollarAmount(1, SumBTC)})
              </span>
            </div>
            <div className="commissions__total--group">
              <div className="label white align__vertical">
                Total ETH{' '}
                <EthereumIcon className="sponsor__icon icon" color="#9ed3da" />
              </div>
              <span className="value">
                {floor(SumETH, 8)} ETH ($
                {calcDollarAmount(2, SumETH)})
              </span>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default Sponsors
