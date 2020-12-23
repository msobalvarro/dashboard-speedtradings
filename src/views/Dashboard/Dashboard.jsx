import React, { useEffect, useState } from "react"

// Import Assets
import "./Dashboard.scss"

// Import Components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import BuyPlan from "../../components/BuyPlan/BuyPlan"
import DashboardDetails from "../../components/DashboardDetails/DashboardDetails"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import MobileMessage from "../../components/Mobile/Mobile"
import Swal from "sweetalert2"
import { Petition } from "../../utils/constanst"


const Dashboard = () => {
    // Estado para mostrar u ocultar el loader
    const [loader, setLoader] = useState(true)

    // Estado que alamacena los datos para los planes BTC y ETH del usuario
    const [dataDashoardBTC, setDataDashboardBTC] = useState({ info: null, history: null })
    const [dataDashoardETH, setDataDashboardETH] = useState({ info: null, history: null })

    const ConfigurateComponent = async () => {
        try {
            // Get data BTC
            const { data: dataBTC } = await Petition.get('/dashboard/1')

            // verificamos si hay un error al cargar los datos
            if (dataBTC.error) {
                throw String(dataBTC.message)
            } else if (Object.keys(dataBTC).length > 0) {
                setDataDashboardBTC(dataBTC)
            }

            // Get data ETH
            const { data: dataETH } = await Petition.get('/dashboard/2')

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
                            (dataDashoardBTC.info !== null && dataDashoardBTC.info.amount !== null) &&
                            <DashboardDetails type="btc" data={dataDashoardBTC} />
                        }

                        {
                            dataDashoardBTC.info === null &&
                            <BuyPlan onBuy={ConfigurateComponent} idCrypto={1} />
                        }
                    </div>

                    <div className="content">
                        {
                            (dataDashoardETH.info !== null && dataDashoardETH.info?.amount !== null) &&
                            <DashboardDetails type="eth" data={dataDashoardETH} />
                        }

                        {
                            dataDashoardETH.info === null &&
                            <BuyPlan onBuy={ConfigurateComponent} idCrypto={2} />
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard