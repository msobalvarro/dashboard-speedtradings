import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

const chartOptions = {
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

const LineChart = ({ dataDashoardBTC, dataDashoardETH }) => {
  const [chartData, setChartData] = useState({})

  const getLabels = _data => {
    if (!_data) return []

    //Obtener los labels
    return _data.map(item => moment(item.date).format('ddd DD MMM'))
  }

  const getSeries = _data => {
    if (!_data) return []

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

  useEffect(() => {
    //Cargamos los datos de la grafica
    loadChart()
    console.log(dataDashoardBTC)
  }, [dataDashoardBTC, dataDashoardETH])

  return (
    <section className="graphic__container">
      <Line data={chartData} options={chartOptions} />
    </section>
  )
}

export default LineChart
