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
    const valueToday = 12.5
    const planAmount = 10

    const data = {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"],
        series: [
            [0.5, 1, 0.8, 0.9]
        ]
    }

    return (
        <div className="container-dashboard">
            <NavigationBar />

            <div className="content-dashboard">
                <div className="content">
                    <HeaderDashboard type="btc" amount={planAmount} amountToday={valueToday} />

                    <div className="content-chart">
                        <ChartistGraph data={data} options={optionsChartDashboard} type="Line" />
                    </div>
                </div>

                <div className="line" />

                <div className="content">
                    <BuyPlan type="eth" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard