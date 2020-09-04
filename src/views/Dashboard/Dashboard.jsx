import React, { useRef, useEffect, useState } from "react"
import "chartist/dist/scss/chartist.scss"
import ChartistGraph from 'react-chartist'
import Moment from "moment"
import lodash_math from "lodash/math"

// Import Assets
import "./Dashboard.scss"

// Import Components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import BuyPlan from "../../components/BuyPlan/BuyPlan"
import HeaderDashboard from "../../components/HeaderDashboard/HeaderDashboard"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import MobileMessage from "../../components/Mobile/Mobile"
import Swal from "sweetalert2"
import { optionsChartDashboard, Petition, calculateCryptoPriceWithoutFee } from "../../utils/constanst"
import { useSelector } from "react-redux"


const DashboardDetails = ({ data, type = "" }) => {
    const [showMoreContent, setShow] = useState(false)
    const [cryptoPrices, setCryptoPrices] = useState({BTC: null, ETH: null})
    const labels = []
    const series = []

    const showMoreRef = useRef(null)

    const showMore = () => {
        setShow(true)

        showMoreRef.current.scrollIntoView()
    }

    if (data[2] !== null) {

        // Cortamos el historial hasta que tenga acomulado 10 depositos
        // Cortamos para que muestre los ultimos 5 dias
        const lastData = data[2].length > 10 ? data[2].slice(data[2].length - 6, data[2].length - 1) : data[2]

        lastData.reverse().map(item => {
            labels.push(Moment(item.date).format('dddd'))
            series.push(item.amount)
        })
    }

    // const [dataChart, setDataChart] = useState({})

    const dataChart = {
        labels,
        series: [series]
    }

    /**Costante que almacena el total de las ganancias */
    const amountSumArr = []

    /** Calcula el total de la profit-table */
    const calculateTotalProfitTable = (data) => {
        const sum = data.reduce((a, b) => a + b, 0)
        const total = lodash_math.floor(sum, 8)

        return total
    }

    /**
     * Obtiene los precios de la coinmarketcap
     * */
    const getAllPrices = async () => {
        await Petition.get("/collection/prices")
            .then(
                ({ data }) => {
                    if (data.error) {
                        Swal.fire("Ha ocurrido un error", data.message, "error")
                    } else {
                        const { BTC, ETH } = data

                        setCryptoPrices({ BTC, ETH })
                    }
                }
            )
    }

    // Se cargan los precios de las monedas
    useEffect(() => {
        getAllPrices()
    }, [data, type])

    // Se indica la lista de transacciones a listar

    return (
        <>
            {
                data[1].approved === 0 &&
                <h1 className="message-disabled">Tu plan se activara cuando sea verificado</h1>
            }

            <div className={data[1].approved === 0 ? 'disabled' : ''}>
                <HeaderDashboard type={type} disabled={data[1].approved === 0} idInvestment={data[0].id_investment} amount={(data[0].amount)} amountToday={data[0].total_paid} />

                <div className="card chart">
                    <ChartistGraph data={dataChart} options={optionsChartDashboard} type="Line" />
                </div>

                <div className="card details">
                    <div className="row">
                        <div className="col">
                            <h2 className="big">
                                {
                                    Moment(data[1].start_date).format('MMM. D, YYYY')
                                }
                            </h2>
                            <span>Fecha de inicio</span>
                        </div>

                        <div className="col yellow">
                            <h2 className="big">
                                {
                                    (data[1].amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Monto a ganar</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <h2>
                                {
                                    data[1].last_pay !== null
                                        ? (data[1].last_pay) + ' ' + type.toUpperCase()
                                        : <span>(Sin reportes)</span>
                                }
                            </h2>
                            <span>Ultimo reporte de ganancia</span>
                        </div>

                        <div className="col yellow">
                            <h2>
                                {
                                    data[1].amount_rest !== null
                                        ? (data[1].amount_rest) + ' ' + type.toUpperCase()
                                        : (data[1].amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Saldo pendiente</span>
                        </div>
                    </div>
                </div>

                <div className="card profit-table">
                    {
                        data[2] !== null &&
                        <div className="table">
                            <div className="header">
                                <span>Fecha</span>
                                <span>Pocentaje</span>
                                <span>Ganancias</span>
                                <span>USD</span>
                            </div>
                            <div className={`body ${!showMoreContent ? 'hidden' : ''}`}>
                                {
                                    data[2].map((item, index) => {
                                        amountSumArr.push(item.amount)

                                        return (
                                            <div className={`row ${Moment().get('week') !== Moment(item.date).get('week') ? 'paymented' : ''}`} key={index}>
                                                <span>{Moment(item.date).format('MMM. D, YYYY')}</span>
                                                <span>{item.percentage}%</span>
                                                <span>{item.amount}</span>
                                                <span>
                                                    $ {
                                                        cryptoPrices.BTC !== null
                                                        ? (type === 'btc')
                                                            ? calculateCryptoPriceWithoutFee(cryptoPrices.BTC.quote.USD.price, item.amount)
                                                            : calculateCryptoPriceWithoutFee(cryptoPrices.ETH.quote.USD.price, item.amount)
                                                        : 0
                                                    }
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={`footer ${(amountSumArr.length > 7 && !showMoreContent) ? 'more' : ''}`}>

                                {
                                    (amountSumArr.length > 7 && !showMoreContent) &&
                                    <span className="show-more" onClick={showMore} ref={showMoreRef}>
                                        Mostrar todo
                                    </span>
                                }

                                <div className="content-total">
                                    <span className="total">Total</span>
                                    <span className="amount">
                                        {
                                            `${calculateTotalProfitTable(amountSumArr)} ${type.toUpperCase()}`
                                        }
                                        {
                                            ` ($ ${
                                                cryptoPrices.BTC !== null
                                                        ? (type === 'btc')
                                                            ? calculateCryptoPriceWithoutFee(cryptoPrices.BTC.quote.USD.price, calculateTotalProfitTable(amountSumArr))
                                                            : calculateCryptoPriceWithoutFee(cryptoPrices.ETH.quote.USD.price, calculateTotalProfitTable(amountSumArr))
                                                        : 0
                                            })`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        data[2] === null &&
                        <h2 className="empty">Aun no hay historial de ganancias</h2>
                    }
                </div>
            </div>
        </>
    )
}

const Dashboard = () => {
    const storage = useSelector(({ globalStorage }) => globalStorage)

    const [loader, setLoader] = useState(true)

    const [dataDashoardBTC, setDataDashboardBTC] = useState({info: null, history: null})
    const [dataDashoardETH, setDataDashboardETH] = useState({info: null, history: null})

    const ConfigurateComponent = async () => {
        try {

            // Get data BTC
            await Petition.get('/dashboard/1',
                {
                    headers: {
                        "x-auth-token": storage.token
                    }
                }
            ).then(response => {
                setDataDashboardBTC(response.data)
            }).catch(reason => { throw reason })


            // Get data ETH
            await Petition.post(
                '/dashboard/2',
                {
                    headers: {
                        "x-auth-token": storage.token
                    }
                }
            ).then(response => {
                setDataDashboardETH(response.data)
            }).catch(reason => { throw reason })

            setLoader(false)

        } catch (error) {
            Swal.fire('Ha ocurrido un error', 'No se ha podido cargar los datos', 'error')

            setLoader(false)
        }
    }


    useEffect(() => {
        ConfigurateComponent()
    }, [])

    return (
        <div className="container-dashboard">
            <MobileMessage />


            <NavigationBar />

            {
                loader &&
                <ActivityIndicator size={128} className="loader-dashboard" />
            }

            {
                !loader &&
                <div className="content-dashboard">
                    <div className="content">
                        {
                            (dataDashoardBTC.info !== null) &&
                            <>
                                {
                                    (dataDashoardBTC.info.amount !== null) &&
                                    < DashboardDetails type="btc" data={dataDashoardBTC} />
                                }


                                {
                                    dataDashoardBTC.info.amount === null &&
                                    <BuyPlan onBuy={ConfigurateComponent} idCrypto={1} />
                                }
                            </>
                        }

                    </div>

                    <div className="content">

                        {
                            dataDashoardETH.length > 0 &&
                            <>
                                {
                                    (dataDashoardETH.info?.amount !== null) &&
                                    <DashboardDetails type="eth" data={dataDashoardETH} />
                                }

                                {
                                    dataDashoardETH.info?.amount === null &&
                                    <BuyPlan onBuy={ConfigurateComponent} idCrypto={2} />
                                }
                            </>
                        }

                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard