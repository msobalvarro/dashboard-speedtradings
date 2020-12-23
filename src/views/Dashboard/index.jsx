import React, { useState, useEffect } from 'react'
import DashboardDetails from '../../components/DashboardDetails'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import Swal from 'sweetalert2'
import { Petition } from '../../utils/constanst'
import { useSelector } from 'react-redux'

//Importar estilos
import './styles.scss'

const Dashboard = () => {
  const storage = useSelector(({ globalStorage }) => globalStorage)

  // Estado para mostrar u ocultar el loader
  const [loader, setLoader] = useState(true)

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
      }

      // Get data ETH
      const { data: dataETH } = await Petition.get('/dashboard/2', headers)

      // verificamos si hay un error al cargar los datos
      if (dataETH.error) {
        throw String(dataETH.message)
      } else if (Object.keys(dataETH).length > 0) {
        setDataDashboardETH(dataETH)
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

  useEffect(() => {
    console.log(dataDashoardBTC)
  }, [dataDashoardBTC])

  return (
    <section className="Dashboard">
      <NavigationBar />
      {loader && <ActivityIndicator size={128} className="loader-dashboard" />}
      <main className="plan__container">
        <DashboardDetails plan="bitcoin" data={dataDashoardBTC.info} />
        <DashboardDetails plan="ethereum" data={dataDashoardETH.info} />
      </main>
      <section className="graphic__container"></section>
    </section>
  )
}

export default Dashboard
