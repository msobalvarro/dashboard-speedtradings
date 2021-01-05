import React, { useState, useEffect } from 'react'

import Swal from 'sweetalert2'
import { Petition } from '../../utils/constanst'
import { useSelector } from 'react-redux'

//Import icons
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-small.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum -small.svg'

//Importar estilos
import './styles.scss'
import 'react-infinite-calendar/styles.css'

//Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import BuyPlan from '../../components/BuyPlan'
import DashboardDetails from '../../components/DashboardDetails'
import EmptyPlan from '../../components/EmptyPlan/EmptyPlan'
import LineChart from '../../components/LineChart/LineChart'
import ListOfProfits from '../../components/ListOfProfits/ListOfProfits'
import ModalUpgrade from '../../components/ModalUpgrade/ModalUpgrade'
import NavigationBar from '../../components/NavigationBar/NavigationBar'

const BITCOIN = { id: 1, name: 'bitcoin' }
const ETHEREUM = { id: 2, name: 'ethereum' }

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

  //Estado para mostrar/ocultar modal de comprar plan
  const [modalBuyPlan, setModalBuyPlan] = useState({
    visible: false,
    idCrypto: 0,
  })

  //Estado para mostrar/ocultar modal de upgrade plan
  const [modalUpgrade, setModalUpgrade] = useState({
    visible: false,
    type: '',
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
        //Preseleccionar por defecto BTC en caso de que este disponible
        setCurrencySelected(BITCOIN.name)
      }

      // Get data ETH
      const { data: dataETH } = await Petition.get('/dashboard/2', headers)

      // verificamos si hay un error al cargar los datos
      if (dataETH.error) {
        throw String(dataETH.message)
      } else if (Object.keys(dataETH).length > 0) {
        setDataDashboardETH(dataETH)
        //Preseleccionar por defecto ETH en caso de que este disponible
        setCurrencySelected(ETHEREUM.name)
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
    <>
      {/*Mostrar el navbar solo cuando los modales esten ocultos*/}
      {!modalBuyPlan.visible && !modalUpgrade.visible && <NavigationBar />}
      <section className="Dashboard">
        {loader && (
          <div className="center__element">
            <ActivityIndicator size={128} className="loader-dashboard" />
          </div>
        )}
        <main className="plan__container">
          {dataDashoardBTC.info ? (
            <DashboardDetails
              plan={BITCOIN.name}
              data={dataDashoardBTC.info}
              upgradePlan={() =>
                setModalUpgrade({ visible: true, type: 'btc' })
              }
            />
          ) : (
            <EmptyPlan
              plan={BITCOIN.name}
              onClick={() =>
                setModalBuyPlan({ visible: true, idCrypto: BITCOIN.id })
              }
            />
          )}

          {dataDashoardETH.info ? (
            <DashboardDetails
              plan={ETHEREUM.name}
              data={dataDashoardETH.info}
              upgradePlan={() =>
                setModalUpgrade({ visible: true, type: 'eth' })
              }
            />
          ) : (
            <EmptyPlan
              plan={ETHEREUM.name}
              onClick={() =>
                setModalBuyPlan({ visible: true, idCrypto: ETHEREUM.id })
              }
            />
          )}
        </main>

        <LineChart
          dataDashoardBTC={dataDashoardBTC}
          dataDashoardETH={dataDashoardETH}
        />

        <section className="profits__container">
          <div className="filters__container">
            <h2>Historial</h2>

            {/*Mostrar el switcher de cambiar de moneda solo cuando BTC y ETH esten disponibles ambos*/}
            {dataDashoardBTC.history && dataDashoardETH.history && (
              <div className="switcher">
                <div
                  className={`${
                    currencySelected === BITCOIN.name
                      ? 'icon__button active'
                      : 'icon__button'
                  }`}
                  onClick={() => setCurrencySelected(BITCOIN.name)}
                >
                  <BitcoinIcon className="switch__icon icon" color="#ffcb08" />
                </div>
                <div
                  className={`${
                    currencySelected === ETHEREUM.name
                      ? 'icon__button active'
                      : 'icon__button'
                  }`}
                  onClick={() => setCurrencySelected(ETHEREUM.name)}
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

      {modalUpgrade.visible &&
        (modalUpgrade.type === 'btc'
          ? dataDashoardBTC.info && (
              <ModalUpgrade
                closeModal={() =>
                  setModalUpgrade({ ...modalUpgrade, visible: false })
                }
                type="btc"
                disabled={dataDashoardBTC.info.approved === 0}
                idInvestment={dataDashoardBTC.info.id_investment}
                amount={dataDashoardBTC.info.amount}
                amountToday={dataDashoardBTC.info.total_paid}
              />
            )
          : dataDashoardETH.info && (
              <ModalUpgrade
                closeModal={() =>
                  setModalUpgrade({ ...modalUpgrade, visible: false })
                }
                type="eth"
                disabled={dataDashoardETH.info.approved === 0}
                idInvestment={dataDashoardETH.info.id_investment}
                amount={dataDashoardETH.info.amount}
                amountToday={dataDashoardETH.info.total_paid}
              />
            ))}

      {modalBuyPlan.visible && (
        <BuyPlan
          onBuy={ConfigurateComponent}
          closeModal={() =>
            setModalBuyPlan({ ...modalBuyPlan, visible: false })
          }
          idCrypto={modalBuyPlan.idCrypto}
        />
      )}
    </>
  )
}

export default Dashboard
