import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { Petition, calculateCryptoPriceWithoutFee } from "../../utils/constanst"

// Import styles and assets
import astronaut from "../../static/images/astronaut.png"
import "./Sponsors.scss"

// Imports components
import Swal from "sweetalert2"
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import moment from "moment"


const Sponsors = () => {
    const { globalStorage } = useSelector(storage => storage)
    const urlSponsor = 'https://' + window.location.host + '/#/register/' + globalStorage.username
    const [loader, setLoader] = useState(true)

    const [dataBTC, setDataBTC] = useState([])
    const [dataETH, setDataETH] = useState([])

    const [SumBTC, setSumBTC] = useState(0)
    const [SumETH, setSumETH] = useState(0)

    const [cryptoPrices, setCryptoPrices] = useState({BTC: null, ETH: null})

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
                        throw data.message
                    }

                    if (data && status === 200) {
                        configurateData(data)

                    }

                    setLoader(false)
                })
                .catch(reason => {
                    throw reason
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

    const configurateData = (allData = []) => {
        const btc = []
        const eth = []

        // sum all 
        const _sumBTC = []
        const _sumETH = []

        for (let index = 0; index < allData.length; index++) {
            const item = allData[index]


            // Si es bitoin
            if (item.id_currency === 1) {
                _sumBTC.push(item.amount * 0.05)

                btc.push(item)
            }

            if (item.id_currency === 2) {
                _sumETH.push(item.amount * 0.05)

                eth.push(item)
            }
        }

        setDataBTC(btc)
        setDataETH(eth)

        setSumBTC(_sumBTC.reduce((a, b) => a + b, 0))
        setSumETH(_sumETH.reduce((a, b) => a + b, 0))
    }

    const copyLink = () => {
        navigator.clipboard.writeText(urlSponsor).catch(_ => {
            return false
        })

        Swal.fire('Listo!', 'Link de referencia copiado, comparte con tus amigos!', 'success')
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

    // se cargan los precios de las monedas
    useEffect(() => {
        getAllPrices()
    }, [])


    return (
        <div className="container-sponsors">
            <NavigationBar />
            {/* <h2>{urlSponsor}</h2> */}

            <div className="row-header">
                <span className="label">
                    Comparte tu link de referencia <b>(Funciona si tienes planes activos)</b>
                </span>
                <div className="content-info">
                    <div className="col">
                        <input type="text" disabled value={urlSponsor} className="text-input large" />

                        <button className="button secondary" onClick={copyLink}>Copiar</button>
                    </div>
                    <div className="col">
                        <input type="search" placeholder="Filtrar" className="text-input search" />
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
                        <h2 className="title">Ganancias en Bitcoin</h2>

                        <div className={`content-data${dataBTC.length === 0 ? ' empty' : ''}`}>
                            {
                                dataBTC.length > 0 &&
                                <>
                                    <div className="header">
                                        <span>Referido</span>
                                        <span>Fecha de registro</span>
                                        <span>Inversion</span>
                                        <span>Ganancia</span>
                                        <span>USD</span>
                                    </div>
                                    <div className="body">
                                        {
                                            dataBTC.map((item, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <span>{item.firstname} {item.lastname}</span>
                                                        <span>{moment(item.registration_date).format('MMM. D, YYYY')}</span>
                                                        <span>{item.amount}</span>
                                                        <span>{item.amount * 0.05}</span>
                                                        <span>
                                                            $ {
                                                                cryptoPrices.BTC !== null
                                                                ? calculateCryptoPriceWithoutFee(
                                                                        cryptoPrices.BTC.quote.USD.price,
                                                                        item.amount * 0.05
                                                                    )
                                                                : 0
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="footer">
                                        Total {SumBTC} ($ 
                                            {
                                                cryptoPrices.BTC !== null
                                                ? calculateCryptoPriceWithoutFee(cryptoPrices.BTC.quote.USD.price, SumBTC)
                                                : 0
                                            }
                                        )
                                    </div>
                                </>
                            }

                            {
                                dataBTC.length === 0 &&
                                <>
                                    <img src={astronaut} alt="empty" />
                                    <h2>Sin lista de referidos</h2>
                                </>
                            }
                        </div>

                    </div>

                    <div className={`table`}>
                        <h2 className="title right">Ganancias en Ethereum</h2>

                        <div className={`content-data${dataETH.length === 0 ? ' empty' : ''}`}>
                            {
                                dataETH.length > 0 &&
                                <>
                                    <div className="header">
                                        <span>Referido</span>
                                        <span>Fecha de registro</span>
                                        <span>Inversion</span>
                                        <span>Ganancia</span>
                                        <span>USD</span>
                                    </div>
                                    <div className="body">
                                        {
                                            dataETH.map((item, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <span>{item.firstname} {item.lastname}</span>
                                                        <span>{moment(item.registration_date).format('MMM. D, YYYY')}</span>
                                                        <span>{item.amount}</span>
                                                        <span>{item.amount * 0.05}</span>
                                                        <span>
                                                            $ {
                                                                cryptoPrices.BTC !== null
                                                                ? calculateCryptoPriceWithoutFee(
                                                                        cryptoPrices.ETH.quote.USD.price,
                                                                        item.amount * 0.05
                                                                    )
                                                                : 0
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="footer">
                                        Total {SumETH} ($ 
                                            {
                                                cryptoPrices.ETH !== null
                                                ? calculateCryptoPriceWithoutFee(cryptoPrices.ETH.quote.USD.price, SumETH)
                                                : 0
                                            }
                                        )
                                    </div>
                                </>
                            }

                            {
                                dataETH.length === 0 &&
                                <>
                                    <img src={astronaut} alt="empty" />
                                    <h2>Sin lista de referidos</h2>
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