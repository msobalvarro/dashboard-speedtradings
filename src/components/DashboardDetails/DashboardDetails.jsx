import React, { useState, useRef } from "react"
import ChartistGraph from "react-chartist"
import "chartist/dist/scss/chartist.scss"
import moment from "moment"
import "./DashboardDetails.scss"

// Import Components
import DashboardAllReports from "../../components/DashboardAllReports/DashboardAllReports"
import HeaderDashboard from "../../components/HeaderDashboard/HeaderDashboard"

// Import utils
import { optionsChartDashboard, calculateCryptoPriceWithoutFee } from "../../utils/constanst"

/**
 * @param {Object} data - infromación del plan del usuario
 * @param {String} type - Tipo de moneda
 */
const DashboardDetails = ({ data = {}, type = "" }) => {
    // Estado para mostrar u ocultar el modal del historial completo de inversiones
    const [showMoreContent, setShow] = useState(false)

    // Estados para mostrar indicadores en la gráfica
    const labels = []
    const series = []

    // Referencia del modal de mostrar el historial de inversiones
    const showMoreRef = useRef(null)

    /**Costante que almacena el total de las ganancias */
    const amountSumArr = []

    /** Destructuración de las data recibida para separar el historial, la info y el precio */
    const {history, info, price=0} = data;

    const showMore = () => {
        setShow(true)
    }

    /**Creamos el algoritmo para ordenar los datos de la grafica */
    if (history.length > 0) {

        for (let index = 0; index < data.history.length - 5; index++) {
            const item = data.history[index]

            labels.push(moment(item.date).format('dddd'))
            series.push(item.amount)
            amountSumArr.push(item.amount)
        }
    }

    // Datos para la gráfica
    const dataChart = {
        labels,
        series: [series]
    }

    // Se indica la lista de transacciones a listar
    return (
        <>
            {
                info.approved === 0 &&
                <h1 className="message-disabled">Tu plan se activara cuando sea verificado</h1>
            }

            <div className={info.approved === 0 ? 'disabled' : ''}>
                <HeaderDashboard 
                    type={type}
                    disabled={info.approved === 0}
                    idInvestment={info.id_investment}
                    amount={(info.amount)}
                    amountToday={info.total_paid} />

                <div className="card chart">
                    <ChartistGraph data={dataChart} options={optionsChartDashboard} type="Line" />
                </div>

                <div className="card details">
                    <div className="row">
                        <div className="col">
                            <h2 className="big">
                                {
                                    moment(info.start_date).format('MMM. D, YYYY')
                                }
                            </h2>
                            <span>Fecha de inicio</span>
                        </div>

                        <div className="col yellow">
                            <h2 className="big">
                                {
                                    (info.amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Monto a ganar</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <h2>
                                {
                                    info.last_pay !== null
                                        ? (info.last_pay) + ' ' + type.toUpperCase()
                                        : <span>(Sin reportes)</span>
                                }
                            </h2>
                            <span>Ultimo reporte de ganancia</span>
                        </div>

                        <div className="col yellow">
                            <h2>
                                {
                                    info.amount_rest !== null
                                        ? (info.amount_rest) + ' ' + type.toUpperCase()
                                        : (info.amount_to_win) + ' ' + type.toUpperCase()
                                }
                            </h2>
                            <span>Saldo pendiente</span>
                        </div>
                    </div>
                </div>

                {/** Historial del los últimos 10 movimientos de inversión */}
                <div className="card profit-table">
                    {
                        history.length !== 0 &&
                        <div className="table">
                            <div className="header">
                                <span>Fecha</span>
                                <span>Pocentaje</span>
                                <span>Ganancias</span>
                                <span>USD</span>
                            </div>
                            <div className="body">
                                {
                                    history.map((item, index) => (
                                        <div className={`row ${moment().get('week') !== moment(item.date).get('week') ? 'paymented' : ''}`} key={index}>
                                            <span>{moment(item.date).format('MMM. D, YYYY')}</span>
                                            <span>{item.percentage}%</span>
                                            <span>{item.amount}</span>
                                            <span>
                                                $ {
                                                    price !== 0
                                                        ? calculateCryptoPriceWithoutFee(price, item.amount)
                                                        : 0
                                                }
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={`footer ${(!showMoreContent) ? 'more' : ''}`}>

                                {
                                    (!showMoreContent) &&
                                    <span className="show-more" onClick={showMore} ref={showMoreRef}>
                                        Mostrar todo
                                    </span>
                                }
                            </div>
                        </div>
                    }

                    {
                        history.length === 0 &&
                        <h2 className="empty">Aun no hay historial de ganancias</h2>
                    }
                </div>

                {
                    showMoreContent &&
                    <DashboardAllReports type={type} onClose={_ => setShow(false)}/>
                }
            </div>
        </>
    )
}

export default DashboardDetails