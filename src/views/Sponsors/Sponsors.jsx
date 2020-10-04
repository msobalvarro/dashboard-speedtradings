import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import {
    Petition,
    calculateCryptoPriceWithoutFee,
    copyData,
    floor
} from "../../utils/constanst"

// Import styles and assets
import astronaut from "../../static/images/astronaut.png"
import { ReactComponent as BitcoinIcon } from "../../static/icons/bitcoin.svg"
import { ReactComponent as EthereumIcon } from "../../static/icons/ether.svg"
import "./Sponsors.scss"

// Imports components
import Swal from "sweetalert2"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import moment from "moment"


const Sponsors = () => {
    const { globalStorage } = useSelector(storage => storage)
    const urlSponsor = 'https://' + window.location.host + '/#/register/' + globalStorage.username

    // Estado para controlar la visibilidad del indicador de carga
    const [loader, setLoader] = useState(true)

    // Estados para almacenar la información de los planes
    const [data, setData] = useState([])

    const [SumBTC, setSumBTC] = useState(0)
    const [SumETH, setSumETH] = useState(0)

    // Estado para almacenar los precios de las monedas en dólares
    const [cryptoPrices, setCryptoPrices] = useState({BTC: null, ETH: null})

    // Estado para almacenar el valor de búsqueda para el filtro
    const [filterValue, setFilterValue] = useState('')

    useEffect(() => {
        try {
            setLoader(true)

            Petition.get(`/collection/sponsors/${globalStorage.id_user}`, {
                headers: {
                    "x-auth-token": globalStorage.token
                }
            })
                .then(({ data, status }) => {
                    if (data.error) {
                        throw String(data.message)
                    }

                    if (data && status === 200) {
                        configurateData(data)

                    }
                    setLoader(false)
                })
                .catch(reason => {
                    throw String(reason)
                })
        } catch (error) {
            Swal.fire(
                'Ha ocurrido un error',
                'Se ha producido un error al cargar los datos, intentelo mas tarde o contacte a soporte',
                'error'
            )

            setLoader(false)
        }
    }, [])

    /**
     * @param {Array} AllData
     */
    const configurateData = (allData = []) => {
        // sum all comissions 
        let _sumBTC = 0
        let _sumETH = 0

        setData(allData)

        // Suma los montos de las comisiones para cada moneda
        allData.forEach(item => {
            switch(item.id_currency) {
                // Si es Bitcoin
                case 1:
                    _sumBTC += item.comission || 0
                    break

                // Si es Ethereum
                case 2:
                    _sumETH += item.comission || 0
                    break

                default:
                    break
            }
        })

        setSumBTC(_sumBTC)
        setSumETH(_sumETH)
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

    /**
     * Función que calcula el valor en dolares de la comisión según el tipo de moneda
     * @param {Number} _id_currency - id de la criptomoneda en la que se pago la comisión
     * @param {Number} _amount - Monto de la comisión en criptomoneda
     * @return {Number} - Monto en dolares del comisión recibida en criptomoneda
     */
    const calcDollarAmount = (_id_currency, _amount) => {
        if(cryptoPrices.BTC === null || cryptoPrices.ETH === null) {
            return 0
        }
        
        /**
         * Se obtiene el valor en dólares de la moneda según su id_current y se calcula 
         * el equivalente en dolares del monto recibido
         */
        switch(_id_currency) {
            // Para Bitcoin
            case 1:
                return calculateCryptoPriceWithoutFee(
                        cryptoPrices.BTC.quote.USD.price,
                        _amount
                    )

            // Para Ethereum
            case 2:
                return calculateCryptoPriceWithoutFee(
                        cryptoPrices.ETH.quote.USD.price,
                        _amount
                    )

            default:
                return 0
        }
    }

    /**
     * Función que realiza el filtro de la lista de comisiones según el valor dentro del
     * input de filtro
     * @param {Array} dataComissions - Lista de las comisiones pagadas al sponsor 
     */
    const filterData = (dataComissions) => {
        if(filterValue.length === 0) return dataComissions

        return dataComissions.filter(item =>
            (
                item.firstname.toLowerCase().search(filterValue) > -1 ||
                item.lastname.toLowerCase().search(filterValue) > -1 ||
                `${item.amount}`.search(filterValue) > -1 ||
                `${item.fee_sponsor}`.search(filterValue) > -1 ||
                `${item.comission}`.search(filterValue) > -1 ||
                (
                    (item.id_currency === 1 && 'bitcoin'.search(filterValue) > -1) ||
                    (item.id_currency === 2 && 'ethereum'.search(filterValue) > -1)
                )
            )
        )
    }

    // se cargan los precios de las monedas
    useEffect(() => {
        getAllPrices()
    }, [])


    return (
        <div className="container-sponsors">
            <NavigationBar />

            <div className="row-header">
                <span className="label">
                    Comparte tu link de referencia <b>(Funciona si tienes planes activos)</b>
                </span>
                <div className="content-info">
                    <div className="col">
                        <input type="text" disabled value={urlSponsor} className="text-input large" />

                        <button 
                            onClick={_ => copyData(urlSponsor, 'Link de referencia copiado, ¡comparte con tus amigos!')}
                            className="button secondary" 
                            >
                            Copiar
                        </button>
                    </div>
                    <div className="col">
                        <input 
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                            type="search"
                            placeholder="Filtrar"
                            className="text-input search" />
                    </div>
                </div>
            </div>

            {
                loader &&
                <ActivityIndicator size={128} className="loader-sponsors" />
            }

            {
                !loader &&
                <div className="content-tables">
                    <div className={`table`}>
                        <h2 className="title">Ganancias en Comisiones</h2>

                        <div className="content-data">
                            {
                                data.length === 0 &&
                                <>
                                    <img src={astronaut} alt="empty" />
                                    <h2>Sin lista de referidos</h2>
                                </>
                            }

                            {
                                data.length !== 0 &&
                                <>
                                    <div className="header">
                                        <span>Referido</span>
                                        <span>Fecha de registro</span>
                                        <span>Moneda</span>
                                        <span>Inversion</span>
                                        <span>Porcentaje</span>
                                        <span>Ganancia</span>
                                        <span>USD</span>
                                    </div>
                                    <div className="body">
                                        {
                                            filterData(data).map((item, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <span>
                                                            {item.firstname} {item.lastname}
                                                        </span>
                                                        <span>
                                                            {
                                                                moment(item.registration_date).format('MMM. D, YYYY')
                                                            }
                                                        </span>
                                                        <p>
                                                            <span>
                                                                {
                                                                    item.id_currency === 1
                                                                    ? 'Bitcoin'
                                                                    : 'Ethereum'
                                                                }
                                                            </span>

                                                            {
                                                                item.id_currency === 1
                                                                ? <BitcoinIcon/>
                                                                : <EthereumIcon/>
                                                            }
                                                        </p>
                                                        <span>
                                                            {
                                                                `${item.amount} ${
                                                                    item.id_currency === 1
                                                                    ? 'BTC'
                                                                    : 'ETH'
                                                                }`
                                                            }
                                                        </span>
                                                        <span>{item.fee_sponsor} %</span>
                                                        <span>
                                                            {
                                                                `${floor(item.comission, 8)} ${
                                                                    item.id_currency === 1
                                                                    ? 'BTC'
                                                                    : 'ETH'
                                                                }`
                                                            }
                                                        </span>
                                                        <span>
                                                            $ {
                                                                calcDollarAmount(
                                                                    item.id_currency,
                                                                    item.comission
                                                                )
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="footer">
                                        <span>Total ganancias BTC</span> 
                                        <span>
                                            {floor(SumBTC, 8)} BTC ($ 
                                                {
                                                    calcDollarAmount(1, SumBTC)
                                                }
                                            )
                                        </span>
                                    </div>
                                    <div className="footer">
                                        <span>Total ganancias ETH</span> 
                                        
                                        <span>
                                            {floor(SumETH, 8)} ETH ($ 
                                                {
                                                    calcDollarAmount(2, SumETH)
                                                }
                                            )
                                        </span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Sponsors