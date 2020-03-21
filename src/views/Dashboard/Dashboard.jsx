import React from "react"
import "chartist/dist/scss/chartist.scss"
import ChartistGraph from 'react-chartist'

// Import Assets
import "./Dashboard.scss"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import BuyPlan from "../../components/BuyPlan/BuyPlan"
import HeaderDashboard from "../../components/HeaderDashboard/HeaderDashboard"
import { optionsChartDashboard } from "../../utils/constanst"

const Dashboard = () => {
    /**Ganancias hasta el dia de hoy */
    const valueToday = 0.0005

    // Plan contratado
    const planAmount = 0.002

    // Ganancias del dia de hoy
    const gainToday = 0.000024

    const data = {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"],
        series: [
            [0.5, 1, 0.8, 0.9, 1.5]
        ]
    }

    return (
        <div className="container-dashboard">
            <NavigationBar />

            <div className="content-dashboard">
                <div className="content">
                    <HeaderDashboard type="btc" amount={planAmount} amountToday={valueToday} />

                    <div className="card chart">
                        <ChartistGraph data={data} options={optionsChartDashboard} type="Line" />
                    </div>

                    <div className="card details">
                        <div className="row">
                            <div className="col">
                                <h2 className="big">Marzo 20 del 2020</h2>
                                <span>Fecha de inicio</span>
                            </div>

                            <div className="col yellow">
                                <h2 className="big">{planAmount * 2}</h2>
                                <span>Monto a ganar</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <h2>{gainToday}</h2>
                                <span>Ganancias del dia</span>
                            </div>

                            <div className="col yellow">
                                <h2>{(planAmount * 2) - valueToday}</h2>
                                <span>Saldo pendiente</span>
                            </div>
                        </div>
                    </div>

                    <div className="card profit-table">
                        <div className="table">
                            <div className="header">
                                <span>Fecha</span>
                                <span>Pocentaje</span>
                                <span>Ganancias</span>
                            </div>
                            <div className="body">
                                <div className="row">
                                    <span>20/30/2020</span>
                                    <span>0.5%</span>
                                    <span>0.0.00024</span>
                                </div>

                                <div className="row">
                                    <span>20/30/2020</span>
                                    <span>0.5%</span>
                                    <span>0.0.00024</span>
                                </div>

                                <div className="row">
                                    <span>20/30/2020</span>
                                    <span>0.5%</span>
                                    <span>0.0.00024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content">
                    <BuyPlan type="eth" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard