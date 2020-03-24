import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import { Petition } from "../../utils/constanst"
import ActivityIndicator from "../ActivityIndicator/Activityindicator"

const images = {
    btc: LogoBTC,
    eth: LogoETH,
}


const BuyPlan = ({ idCrypto = 1, onBuy = () => { } }) => {
    const storage = useSelector(({ globalStorage }) => globalStorage)
    const [plans, setPlans] = useState([])
    const [hash, setHash] = useState('')
    const [amount, setAmount] = useState('default')
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        try {
            // Obtene
            Petition.get(`/collection/investment-plan/${idCrypto}`)
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

    const Buy = () => {
        // Petition
        setLoader(true)

        try {
            if (hash.length < 8) {
                throw 'Hash invalido'
            }

            if (amount === "default") {
                throw "Seleccion un Plan de inversion"
            }

            const data = {
                id_currency: idCrypto,
                id_user: storage.id_user,
                hash,
                amount: Number(amount),
            }

            Petition.post('/buy/plan', data, {
                headers: {
                    "x-auth-token": storage.token
                }
            }).then(({ data }) => {
                if (data.response === "success") {
                    onBuy()
                    Swal.fire(
                        "Plan solicitado",
                        "En breves momentos estaremos confirmando tu transaccion",
                        "success"
                    )
                }


            }).catch(reason => {
                throw reason.toString()
            })

        } catch (error) {
            Swal.fire(error, "Para continuar, debe de llenar ambos campos", "warning")
        }


        setLoader(false)
    }

    return (
        <div className="container-buy-plan">
            <h2>
                Adquirir plan de
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

            <div className="row">
                <span>Selecciona tu plan</span>
                <select className="picker" value={amount} onChange={e => setAmount(e.target.value)}>
                    <option value="default" disabled>Selecciona un plan</option>
                    {
                        plans.map((item, key) =>
                            <option key={key} value={item.amount}>
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

            <div className="row">
                <span>Escribe el hash de transaccion</span>
                <input
                    value={hash}
                    onChange={e => setHash(e.target.value)}
                    type="text"
                    className="text-input"
                    placeholder="ejem.. as4d6as4d65a4sd8" />
            </div>

            <button disabled={loader} className="button secondary large" onClick={Buy}>
                {
                    loader
                        ? <ActivityIndicator size={24} />
                        : 'Comprar'
                }
            </button>
        </div>
    )
}

export default BuyPlan