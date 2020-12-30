import React, { useState, useEffect } from 'react'
import lodash_math from 'lodash/math'
import moment from 'moment'
import { calculateCryptoPriceWithoutFee } from '../../utils/constanst'

import { useWindowWidth } from '../../utils/hooks/useWindowWidth '

//Importar estilos
import './ListOfProfits.scss'

//Import icons
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-small.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum -small.svg'

const BITCOIN = 'bitcoin'

const ListOfProfits = ({
  currencySelected,
  dataDashoardBTC,
  dataDashoardETH,
}) => {
  const [profitsData, setProfitsData] = useState([])

  //estados que almacena el precio de la crypto con ralacion al dolar
  const [btcToDollar, setBtcToDollar] = useState(0)
  const [ethToDollar, setEthToDollar] = useState(0)

  //estado que almacena la sumaria total de las ganancias
  const [sumTotalBtc, setSumTotalBtc] = useState(0)
  const [sumTotalEth, setSumTotalEth] = useState(0)

  //Estado que almacena si se esta visualizando la pagina desde un telefono o no
  const [isMobile, setIsMobile] = useState(false)

  //Obtenemos de manera imperativa el ancho de la pantalla
  const windowWidth = useWindowWidth()

  //Breakpoints
  const tabletSmall = 580
  const mobileSmall = 380

  /** Calcula el total de la profit-table */
  const calculateTotalProfitTable = data => {
    const amountSumArr = data.map(item => item.amount)

    const sum = amountSumArr.reduce((a, b) => a + b, 0)
    const total = lodash_math.floor(sum, 8)

    return total
  }

  //Funcion que se ejecuta cuando cambiamos la moneda en el switcher
  const changeCurrency = () => {
    if (currencySelected === BITCOIN) {
      if (!dataDashoardBTC?.history) return false

      //Obtenemos la suma total de ganancias en bitcoin
      const totalBTC = calculateTotalProfitTable(dataDashoardBTC.history)
      setSumTotalEth(totalBTC)

      //Mostrarmos el historial de ganancias en btc
      setProfitsData(dataDashoardBTC.history)
    } else {
      if (!dataDashoardETH?.history) return false

      //Obtenemos la suma total de ganancias en ethereum
      const totalETH = calculateTotalProfitTable(dataDashoardETH.history)
      setSumTotalEth(totalETH)

      //Mostrarmos el historial de ganancias en ETH
      setProfitsData(dataDashoardETH.history)
    }
  }

  //Cargar datos iniciales
  useEffect(() => {
    //Guardar el precio de la criptomoneda
    setBtcToDollar(dataDashoardBTC?.price || 0)
    setEthToDollar(dataDashoardETH?.price || 0)

    if (dataDashoardBTC?.history) {
      //Obtener el total de ganancias en BTC
      const totalBTC = calculateTotalProfitTable(dataDashoardBTC.history)
      setSumTotalBtc(totalBTC)

      return setProfitsData(dataDashoardBTC.history)
    }

    if (dataDashoardETH?.history) {
      //Obtener el total de ganancias en  ETH
      const totalETH = calculateTotalProfitTable(dataDashoardETH.history)
      setSumTotalEth(totalETH)

      return setProfitsData(dataDashoardETH.history)
    }
  }, [dataDashoardBTC, dataDashoardETH])

  //Obtener el ancho de la ventana del navegador
  useEffect(() => {
    windowWidth >= tabletSmall ? setIsMobile(false) : setIsMobile(true)
  }, [windowWidth])

  //Cambiar los datos en la tabla cada vez que cambia se cambia el switcher
  useEffect(() => {
    changeCurrency()
  }, [currencySelected])

  return (
    <div className="ListOfProfits">
      <section className="table">
        <div className="table__head">
          <div className="row">
            <span className="table__label">Fecha</span>
            <span className="table__label">Moneda</span>
            <span className="table__label">
              {isMobile ? '%' : 'Porcentaje'}
            </span>
            <span className="table__label">Ganancia</span>
            {windowWidth >= mobileSmall && (
              <span className="table__label">USD</span>
            )}
          </div>
        </div>

        <div className="table__body">
          {profitsData.length > 0 &&
            profitsData.map((profit, index) => (
              <div key={index}>
                <div className="row">
                  <span className="table__value">
                    {isMobile
                      ? moment(profit?.date).format('DD/MM/YYYY')
                      : moment(profit?.date).format('MMM. D, YYYY')}
                  </span>
                  <div className="table__value">
                    {isMobile ? (
                      <div className="coin__container">
                        {currencySelected === BITCOIN ? (
                          <BitcoinIcon
                            className="icon-small icon"
                            color="#ffcb08"
                          />
                        ) : (
                          <EthereumIcon
                            className="icon-small icon"
                            color="#9ed3da"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="coin__container">
                        {currencySelected === BITCOIN ? (
                          <BitcoinIcon
                            className="icon-small icon"
                            color="#ffcb08"
                          />
                        ) : (
                          <EthereumIcon
                            className="icon-small icon"
                            color="#9ed3da"
                          />
                        )}
                        {currencySelected}
                      </div>
                    )}
                  </div>
                  <span className="table__value">{profit?.percentage} %</span>
                  <span className="table__value">{profit?.amount}</span>
                  {windowWidth >= mobileSmall && (
                    <span className="table__value">
                      ${' '}
                      {calculateCryptoPriceWithoutFee(
                        currencySelected === BITCOIN
                          ? btcToDollar
                          : ethToDollar,
                        profit.amount
                      )}
                    </span>
                  )}
                </div>
                <div className="divisor"></div>
                <div />
              </div>
            ))}
        </div>

        <div className="total__container">
          <div className="total__item">
            <span className="label white">
              Total {currencySelected === BITCOIN ? 'BTC: ' : 'ETH: '}{' '}
            </span>
            <span className="value">
              {currencySelected === BITCOIN ? sumTotalBtc : sumTotalEth}
            </span>
          </div>
          <div className="total__item">
            <span className="label white">Total USD</span>
            <span className="value">
              ${' '}
              {calculateCryptoPriceWithoutFee(
                currencySelected === BITCOIN ? btcToDollar : ethToDollar,
                currencySelected === BITCOIN ? sumTotalBtc : sumTotalEth
              )}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ListOfProfits
