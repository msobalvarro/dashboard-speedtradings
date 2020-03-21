import React, { useEffect, useState } from "react"
import Axios from "axios"
import Swal from "sweetalert2"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import { urlServer } from "../../utils/constanst"

const images = {
    btc: LogoBTC,
    eth: LogoETH,
}

const BuyPlan = ({ idCrypto = 1 }) => {
    const [plans, setPlans] = useState([])

    useEffect(() => {
        try {
            // Obtene
            Axios.get(`${urlServer}/collection/investment-plan/${idCrypto}`)
                .then(({ data }) => {
                    if (data) {
                        setPlans(data)
                    } else {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'No se ha podido cargar alguna infomacion, recargue de nuevo o contacte a soporte',
                            'error'
                        )
                    }
                })
        } catch (error) {

        }
    }, [])

    return (
        <div className="container-buy-plan">
            <h2>
                Espacio para plan de inversion en
                {
                    idCrypto === 1 && ' Bitcoin'
                }

                {
                    idCrypto === 2 && ' Ethereum'
                }
            </h2>

            {
                idCrypto === 1 &&
                <img src={LogoBTC} className="logo-crypto" alt="" />
            }

            {
                idCrypto === 2 &&
                <img src={LogoETH} className="logo-crypto" alt="" />
            }

            <div className="container-picker">
                <span>Selecciona tu plan</span>
                <select className="picker">
                    {
                        plans.map((item, key) =>
                            <option value={item.id}>
                                {item.amount}

                                {
                                    idCrypto === 1 && ' BTC'
                                }

                                {
                                    idCrypto === 2 && ' ETH'
                                }
                            </option>
                        )
                    }
                </select>
            </div>

            <button className="button secondary large">Comprar</button>
        </div>
    )
}

export default BuyPlan