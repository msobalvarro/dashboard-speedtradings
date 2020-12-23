import React, { useState, useEffect } from 'react'
import moment from "moment"
import lodash_math from "lodash/math"
import './DashboardAllReports.scss'

// Import components
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import { Petition, calculateCryptoPriceWithoutFee } from "../../utils/constanst"
import Swal from "sweetalert2"

/**
 * @param {String} type - Tipo de moneda a procesar
 * @param {Callback} onClose - Función a ejecutar cuando se cierra el modal
 */
const DashboardAllReports = ({ type = 'btc', onClose = _ => { } }) => {
    const coinCode = type === 'btc' ? 1 : 2

    // Estado para almacenar los reportes recibidos
    const [allReports, setAllReports] = useState([])
    const [price, setPrice] = useState(0)
    const [loader, setLoader] = useState(false)

    /**Costante que almacena el total de las ganancias */
    const amountSumArr = []

    /** Calcula el total de la profit-table */
    const calculateTotalProfitTable = (data) => {
        const sum = data.reduce((a, b) => a + b, 0)
        const total = lodash_math.floor(sum, 8)

        return total
    }

    // Obtiene el registro de todas las transacciones
    const FetchAllReports = async () => {
        try {
            setLoader(true)

            // Get data BTC
            const { data } = await Petition.get(`/dashboard/all-reports/${coinCode}`)

            // verificamos si hay un error al cargar los datos
            if (data.error) {
                throw String(data.message)
            } else {
                setAllReports(data.history)
                setPrice(data.price)
            }

        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    useEffect(_ => {
        // Se obtiene la lista de todos los reportes
        FetchAllReports()

        document.body.style.overflow = 'hidden'
        return () => document.body.style.overflow = 'unset'
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
                                                    (price !== 0)
                                                        ? calculateCryptoPriceWithoutFee(price, item.amount)
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
                                        ` ($ ${(price !== 0)
                                            ? calculateCryptoPriceWithoutFee(price, calculateTotalProfitTable(amountSumArr))
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

export default DashboardAllReports