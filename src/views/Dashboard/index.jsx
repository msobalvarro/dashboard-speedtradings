import React, { useState, useEffect } from 'react'
import DashboardDetails from '../../components/DashboardDetails'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import Swal from 'sweetalert2'
import { Petition } from '../../utils/constanst'
import { useSelector } from 'react-redux'

import InfiniteCalendar from 'react-infinite-calendar'

//Import icons
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-small.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum -small.svg'

//Importar estilos
import './styles.scss'
import 'react-infinite-calendar/styles.css'
import LineChart from '../../components/LineChart/LineChart'
import ListOfProfits from '../../components/ListOfProfits/ListOfProfits'

const BITCOIN = 'bitcoin'
const ETHEREUM = 'ethereum'

const Dashboard = () => {
  const storage = useSelector(({ globalStorage }) => globalStorage)

  // Estado para mostrar u ocultar el loader
  const [loader, setLoader] = useState(true)

  // Estado para cambiar los datos que se muestran en la tabla de ganancias
  const [currencySelected, setCurrencySelected] = useState('')

  // Estado que alamacena los datos para los planes BTC y ETH del usuario
  const [dataDashoardBTC, setDataDashboardBTC] = useState({
    info: null,
    history: null,
  })
  const [dataDashoardETH, setDataDashboardETH] = useState({
    info: null,
    history: null,
  })

  const ConfigurateComponent = async () => {
    try {
      // constant header petition
      const headers = {
        headers: {
          'x-auth-token': storage.token,
        },
      }

      // Get data BTC
      const { data: dataBTC } = await Petition.get('/dashboard/1', headers)

      // verificamos si hay un error al cargar los datos
      if (dataBTC.error) {
        throw String(dataBTC.message)
      } else if (Object.keys(dataBTC).length > 0) {
        setDataDashboardBTC(dataBTC)
        setCurrencySelected(BITCOIN)
      }

      // Get data ETH
      const { data: dataETH } = await Petition.get('/dashboard/2', headers)

      // verificamos si hay un error al cargar los datos
      if (dataETH.error) {
        throw String(dataETH.message)
      } else if (Object.keys(dataETH).length > 0) {
        setDataDashboardETH(dataETH)
        setCurrencySelected(ETHEREUM)
      }

      setLoader(false)
    } catch (error) {
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    ConfigurateComponent()
  }, [])

  return (
    <div>
      <NavigationBar />
      <section className="Dashboard">
        {loader && (
          <div className="center__element">
            <ActivityIndicator size={128} className="loader-dashboard" />
          </div>
        )}
        <main className="plan__container">
          <DashboardDetails plan={BITCOIN} data={dataDashoardBTC.info} />
          <DashboardDetails plan={ETHEREUM} data={dataDashoardETH.info} />
        </main>

        <LineChart
          dataDashoardBTC={dataDashoardBTC}
          dataDashoardETH={dataDashoardETH}
        />

        <section className="profits__container">
          <div className="filters__container">
            <h2>Historial</h2>

            {dataDashoardBTC.history && dataDashoardETH.history && (
              <div className="switcher">
                <div
                  className={`${
                    currencySelected === BITCOIN
                      ? 'icon__button active'
                      : 'icon__button'
                  }`}
                  onClick={() => setCurrencySelected(BITCOIN)}
                >
                  <BitcoinIcon className="switch__icon icon" color="#ffcb08" />
                </div>
                <div
                  className={`${
                    currencySelected === ETHEREUM
                      ? 'icon__button active'
                      : 'icon__button'
                  }`}
                  onClick={() => setCurrencySelected(ETHEREUM)}
                >
                  <EthereumIcon className="switch__icon icon" color="#9ed3da" />
                </div>
              </div>
            )}
          </div>

          <ListOfProfits
            currencySelected={currencySelected}
            dataDashoardBTC={dataDashoardBTC}
            dataDashoardETH={dataDashoardETH}
          />
        </section>
      </section>
    </div>
  )
}

export default Dashboard
