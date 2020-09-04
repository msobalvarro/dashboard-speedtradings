import React, { useRef, useEffect, useState } from "react"
import "chartist/dist/scss/chartist.scss"
import ChartistGraph from 'react-chartist'
import moment from "moment"
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


const DashboardDetails = ({ data = {}, type = "" }) => {
    const [showMoreContent, setShow] = useState(false)
    const [cryptoPrices, setCryptoPrices] = useState({ BTC: null, ETH: null })
    const labels = []
    const series = []

    const showMoreRef = useRef(null)

    const showMore = () => {
        setShow(true)

        showMoreRef.current.scrollIntoView()
    }

    /**Creamos el algoritmo para ordenar los datos de la grafica */
    if (data.history.length > 0) {

        for (let index = 0; index < data.history.length - 5; index++) {
            const item = data.history[index]

            labels.push(moment(item.date).format('dddd'))
            series.push(item.amount)
        }
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
        try {
            const { data } = await Petition.get("/collection/prices")

            if (data.error) {
                throw String(data.message)
            } else {
                const { BTC, ETH } = data

                setCryptoPrices({ BTC, ETH })
            }

        } catch (error) {
            Swal.fire("Ha ocurrdio un error", error.toString(), "warning")
        }
    }

    // Se cargan los precios de las monedas
    useEffect(() => {
        getAllPrices()
    }, [data, type])

    // Se indica la lista de transacciones a listar

    return (
        <>
            {
                data.info.approved === 0 &&
                <h1 className="message-disabled">Tu plan se activara cuando sea verificado</h1>
            }

            <div className={data.info.approved === 0 ? 'disabled' : ''}>
                <HeaderDashboard type={type} disabled={data.info.approved === 0} idInvestment={data.info.id_investment} amount={(data.info.amount)} amountToday={data.info.total_paid} />

                <div className="card chart">
                    <ChartistGraph data={dataChart} options={optionsChartDashboard} type="Line" />
                </div>

                <div className="card details">
                    <div className="row">
                        <div className="col">
                            <h2 className="big">
                                {
                                    moment(data.info.start_date).format('MMM. D, YYYY')
                                }
                            </h2>
                            <span>Fecha de inicio</span>
                        </div>

                        <div className="col yellow">
                            <h2 className="big">
                                {
                                    (data.info.amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Monto a ganar</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <h2>
                                {
                                    data.info.last_pay !== null
                                        ? (data.info.last_pay) + ' ' + type.toUpperCase()
                                        : <span>(Sin reportes)</span>
                                }
                            </h2>
                            <span>Ultimo reporte de ganancia</span>
                        </div>

                        <div className="col yellow">
                            <h2>
                                {
                                    data.info.amount_rest !== null
                                        ? (data.info.amount_rest) + ' ' + type.toUpperCase()
                                        : (data.info.amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Saldo pendiente</span>
                        </div>
                    </div>
                </div>

                <div className="card profit-table">
                    {
                        data.history.length !== 0 &&
                        <div className="table">
                            <div className="header">
                                <span>Fecha</span>
                                <span>Pocentaje</span>
                                <span>Ganancias</span>
                                <span>USD</span>
                            </div>
                            <div className="body">
                                {
                                    data.history.map((item, index) => (
                                        <div className={`row ${moment().get('week') !== moment(item.date).get('week') ? 'paymented' : ''}`} key={index}>
                                            <span>{moment(item.date).format('MMM. D, YYYY')}</span>
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
                                    ))
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
                        data.history.length === 0 &&
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

    const [dataDashoardBTC, setDataDashboardBTC] = useState({ info: null, history: null })
    const [dataDashoardETH, setDataDashboardETH] = useState({ info: null, history: null })

    const ConfigurateComponent = async () => {
        try {

            // constant header petition
            const headers = {
                headers: {
                    "x-auth-token": storage.token
                }
            }

            // Get data BTC
            const { data: dataBTC } = await Petition.get('/dashboard/1', headers)

            console.log(dataBTC)

            // verificamos si hay un error al cargar los datos
            if (dataBTC.error) {
                throw String(dataBTC.message)
            } else {
                setDataDashboardBTC(dataBTC)
            }


            // Get data ETH
            const { data: dataETH } = await Petition.get('/dashboard/2', headers)

            console.log(dataETH)

            // verificamos si hay un error al cargar los datos
            if (dataETH.error) {
                throw String(dataETH.message)
            } else {
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
                                    <DashboardDetails type="btc" data={dataDashoardBTC} />
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