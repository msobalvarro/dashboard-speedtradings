import React, { useState, useEffect } from 'react'
import DashboardDetails from '../../components/DashboardDetails'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import Swal from 'sweetalert2'
import { Petition } from '../../utils/constanst'
import { useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

import InfiniteCalendar from 'react-infinite-calendar'

import DateRangePicker from 'react-daterange-picker'

import 'react-daterange-picker/dist/css/react-calendar.css'

//Importar estilos
import './styles.scss'
import 'react-infinite-calendar/styles.css'
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

  const [chartData, setChartData] = useState({})

  const getLabels = _data => {
    if (!_data) return false

    //Obtener los labels
    return _data.map(item => moment(item.date).format('ddd DD MMM'))
  }

  const getSeries = _data => {
    if (!_data) return false

    //Obtener los valores para las graficas
    return _data.map(item => item.amount)
  }

  const loadChart = () => {
    setChartData({
      labels: getLabels(dataDashoardBTC.history),
      datasets: [
        {
          label: 'Bitcoin',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#ffcb08',
          borderColor: '#ffcb08',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#ffcb08',
          pointBackgroundColor: '#ffcb08',
          pointBorderWidth: 8,
          pointRadius: 1,
          pointHitRadius: 10,
          data: getSeries(dataDashoardBTC.history),
        },
        {
          label: 'Ethereum',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#9ed3da',
          borderColor: '#9ed3da',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBackgroundColor: '#9ed3da',
          pointBorderColor: '#9ed3da',
          pointBorderWidth: 8,
          pointRadius: 1,
          pointHitRadius: 10,
          data: getSeries(dataDashoardETH.history),
        },
      ],
    })
  }

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
    //Cargamos los datos de la grafica
    loadChart()
  }, [dataDashoardBTC, dataDashoardETH])

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'point',
    },
  }

  const withRange = () => {}
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
          <DashboardDetails plan="bitcoin" data={dataDashoardBTC.info} />
          <DashboardDetails plan="ethereum" data={dataDashoardETH.info} />
        </main>

        <section className="graphic__container">
          <Line data={chartData} options={options} />
        </section>

        <section className="profits__container">
          <h2>Historial</h2>
          <DateRangePicker />
          <input type="date" />
        </section>
      </section>
    </div>
  )
}

export default Dashboard
