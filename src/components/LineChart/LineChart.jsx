import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

const chartOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
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
    const [chartDataBTC, setChartDataBTC] = useState({})
    const [chartDataETH, setChartDataETH] = useState({})

    const getLabels = _data => {
        if (!_data) return []

        //Copiar datos e invetir orden de los valores
        const orderedData = _data.slice()
        orderedData.reverse()

        //Obtener los labels
        return orderedData.map(item => moment(item.date).format('ddd DD MMM'))
    }

    const getSeries = _data => {
        if (!_data) return []

        //Copiar datos e invetir orden de los valores
        const orderedData = _data.slice()

        orderedData.reverse()

        //Obtener los valores para las graficas
        return orderedData.map(item => item.percentage)
    }

    const loadChartBTC = () => {
        setChartDataBTC({
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
            ],
        })
    }
    const loadChartETH = () => {
        setChartDataETH({
            labels: getLabels(dataDashoardBTC.history),
            datasets: [
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
        //cargamos los datos de la grafica
        dataDashoardBTC.history && loadChartBTC()
        dataDashoardETH.history && loadChartETH()
    }, [dataDashoardBTC, dataDashoardETH])

    return (
        <section className="graphic__container">
            {dataDashoardBTC.history && (
                <div className="graphic__item">
                    <Line data={chartDataBTC} options={chartOptions} />
                </div>
            )}

            {dataDashoardETH.history && (
                <div className="graphic__item">
                    <Line data={chartDataETH} options={chartOptions} />
                </div>
            )}
        </section>
    )
}

export default LineChart
