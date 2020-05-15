import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import { Petition, wallets, copyData } from "../../utils/constanst"

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
                    if (data.error) {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'No se ha podido cargar alguna infomacion, recargue de nuevo o contacte a soporte',
                            'error'
                        )
                    } else {
                        setPlans(data)
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

    const copywallet = async () => {
        if (idCrypto === 1) {
            await copyData(wallets.btc)
        }

        if (idCrypto === 2) {
            await copyData(wallets.eth)
        }
    }

    return (
        <div className="container-buy-plan">
            {
                idCrypto === 1 &&
                <img src={LogoBTC} className="logo-crypto" alt="" />
            }

            {
                idCrypto === 2 &&
                <img src={LogoETH} className="logo-crypto" alt="" />
            }

            <h2>
                Adquirir plan de
                {
                    idCrypto === 1 && <span> Bitcoin</span>
                }

                {
                    idCrypto === 2 && <span> Ethereum</span>
                }
            </h2>

            <div className="row wallets">
                <span>Toca para copiar wallet</span>

                {
                    idCrypto === 1 &&
                    <span className="wallet" onClick={copywallet}>{wallets.btc}</span>
                }

                {
                    idCrypto === 2 &&
                    <span className="wallet" onClick={copywallet}>{wallets.eth}</span>
                }
            </div>

            <div className="row">
                <span>Selecciona tu plan</span>
                <select className="picker" value={amount} onChange={e => setAmount(e.target.value)}>
                    <option value="default" disabled>Selecciona un plan</option>
                    {
                        plans.map((item, key) =>
                            <option key={key} value={item.amount}>
                                {
                                    idCrypto === 1 && item.amount + ' BTC'
                                }

                                {
                                    idCrypto === 2 && item.amount + ' ETH'
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
                Comprar
            </button>
        </div>
    )
}

export default BuyPlan