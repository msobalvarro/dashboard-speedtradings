import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { Petition } from "../../utils/constanst"

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
    const urlSponsor = window.location.host + '#/register/' + globalStorage.username
    const [loader, setLoader] = useState(true)

    const [dataBTC, setDataBTC] = useState([])
    const [dataETH, setDataETH] = useState([])

    // sum all 
    const sumBTC = []
    const sumETH = []

    useEffect(() => {
        try {
            setLoader(true)

            Petition.get(`/collection/sponsors/${globalStorage.id_user}`, {
                headers: {
                    "x-auth-token": globalStorage.token
                }
            })
                .then((response) => {
                    console.log(response.data)
                    configurateData(response.data)

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

        for (let index = 0; index < allData.length; index++) {
            const item = allData[index]


            // Si es bitoin
            if (item.id_currency === 1) {
                sumBTC.push(item.amount * 0.05)

                btc.push(item)
            }

            if (item.id_currency === 2) {
                sumETH.push(item.amount * 0.05)

                eth.push(item)
            }
        }

        setDataBTC(btc)
        setDataETH(eth)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(urlSponsor).catch(_ => {
            return false
        })

        Swal.fire('Listo!', 'Link de referencia copiado, comparte con tus amigos!', 'success')
    }


    return (
        <div className="container-sponsors">
            <NavigationBar />
            {/* <h2>{urlSponsor}</h2> */}

            <div className="row-header">
                <span className="label">Comparte tu link de referencia</span>
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
                <div className="container-loader">
                    <ActivityIndicator size={78} />
                </div>
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
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="footer">
                                        Total {sumBTC.reduce((a, b) => a + b, 0)}
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
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="footer">
                                        Total {sumETH.reduce((a, b) => a + b, 0)}
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