import React, { useState, useEffect } from 'react'
import moment from "moment"
import lodash_math from "lodash/math"
import './DashboardAllReports.scss'

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import { Petition, calculateCryptoPriceWithoutFee } from "../../utils/constanst"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"


const DashboardAllReports = ({type='btc', prices={ BTC: null, ETH: null }, onClose=_ => {}}) => {
    // Cargamos el storage
    const storage = useSelector(({ globalStorage }) => globalStorage)
    const coinCode = type === 'btc' ? 1 : 2

    // Estado para almacenar los reportes recibidos
    const [allReports, setAllReports] = useState([])
    const [loader, setLoader] = useState(false)

    /**Costante que almacena el total de las ganancias */
    const amountSumArr = []

    /** Calcula el total de la profit-table */
    const calculateTotalProfitTable = (data) => {
        const sum = data.reduce((a, b) => a + b, 0)
        const total = lodash_math.floor(sum, 8)

        return total
    }

    // constant header petition
    const headers = {
        headers: {
            "x-auth-token": storage.token
        }
    }

    // Obtiene el registro de todas las transacciones
    const FetchAllReports = async () => {
        try {
            setLoader(true)

            // Get data BTC
            const { data } = await Petition.get(`/dashboard/all-reports/${coinCode}`, headers)

            // verificamos si hay un error al cargar los datos
            if (data.error) {
                throw String(data.message)
            } else {
                setAllReports(data);
            }

        } catch(error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    useEffect(_ => {
        FetchAllReports()

        document.body.style.overflow = 'hidden';
        return ()=> document.body.style.overflow = 'unset';
    }, [])

    return (
        <div className="DashboardAllReports">
            {
                loader &&
                <ActivityIndicator size={128} className="loader-dashboard" />
            }

            <button onClick={onClose} className="close">Cerrar</button>

            {
                !loader &&
                <div className="profit-table">
                    <div className="table">
                        <div className="header">
                            <span>Fecha</span>
                            <span>Pocentaje</span>
                            <span>Ganancias</span>
                            <span>USD</span>
                        </div>
                        <div className="body">
                            {
                                allReports.map((item, index) => {
                                    amountSumArr.push(item.amount)
                                    return (
                                        <div className={`row ${moment().get('week') !== moment(item.date).get('week') ? 'paymented' : ''}`} key={index}>
                                            <span>{moment(item.date).format('MMM. D, YYYY')}</span>
                                            <span>{item.percentage}%</span>
                                            <span>{item.amount}</span>
                                            <span>
                                                $ {
                                                    (prices.BTC !== null)
                                                        ? calculateCryptoPriceWithoutFee(prices[type.toUpperCase()], item.amount)
                                                        : 0
                                                }
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={`footer`}>
                            <div className="content-total">
                                <span className="total">Total</span>
                                <span className="amount">
                                    {
                                        `${calculateTotalProfitTable(amountSumArr)} ${type.toUpperCase()}`
                                    }
                                    {
                                        ` ($ ${
                                            (prices.BTC !== null)
                                                ? calculateCryptoPriceWithoutFee(prices[type.toUpperCase()], calculateTotalProfitTable(amountSumArr))
                                                : 0
                                        })`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DashboardAllReports;