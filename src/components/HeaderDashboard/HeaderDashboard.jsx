import React, { useState } from "react"
import { useSelector } from "react-redux"

// Import styles
import "./HeaderDashboard.scss"

// Import Assets
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"
import ProgressBar from "../ProgressBar/ProgressBar"
import { Petition } from "../../utils/constanst"
import Swal from "sweetalert2"

const images = {
    btc: LogoBTC,
    eth: LogoETH,
}

const HeaderDashboard = ({ type = "btc", amount = 0.5, amountToday = 2, idInvestment = 0 }) => {
    const { token } = useSelector(({ globalStorage }) => globalStorage)


    const valuePorcent = amountToday / (amount * 2) * 100
    const [showModal, setShowModal] = useState(false)
    const [list, setList] = useState([])
    const [plan, setPlan] = useState('default')
    const [hash, setHash] = useState('')
    const [loader, setLoader] = useState(false)

    const toggleModal = () => {
        if (showModal === false) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        setShowModal(!showModal)
    }

    const onUpgrade = () => {
        toggleModal()

        const id_currency = type === 'btc' ? 1 : type === 'eth' ? 2 : 0

        if (showModal === false) {
            Petition.get(`/collection/investment-plan/${id_currency}`)
                .then(({ data }) => {
                    console.log(data)
                    if (data) {
                        setList(data)
                    } else {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'No se ha podido cargar alguna infomacion, recargue de nuevo o contacte a soporte',
                            'error'
                        )
                    }
                })
        }

    }

    const UpGradeExecute = async () => {
        try {
            setLoader(true)

            if (plan === 'default') {
                throw 'Seleccione un plan de inversion'
            }

            if (hash.length < 8) {
                throw 'Ingrese un hash valido'
            }

            const data = {
                amount: plan,
                id: idInvestment,
                hash,
            }

            await Petition.post('/buy/upgrade', data, {
                headers: {
                    "x-auth-token": token
                }
            }).then(({ data }) => {
                if (data.error) {
                    throw data.message
                } else {
                    toggleModal()

                    Swal.fire(
                        'Upgrade Completado',
                        'En breves momentos, estaremos atendiendo su peticion de UPGRADE',
                        'success'
                    )
                }                
            }).catch(reason => {
                throw reason.toString()
            })
        } catch (error) {
            Swal.fire(
                error,
                '',
                'warning'
            )
        } finally {
            setLoader(false)
        }
    }

    return (
        <>
            <div className="container-info-crypto">
                <img src={images[type]} className="crypto" alt="crypto" />

                <div className="info">
                    <div className="row">
                        <h1>{amount} {type.toUpperCase()}</h1>

                        <button className="button large secondary" onClick={onUpgrade}>Upgrade</button>
                    </div>

                    <div className="row progress">
                        {/* Progress bar */}
                        <ProgressBar value={valuePorcent} legend={`Ganado (${valuePorcent.toFixed(1)}%)`} />
                    </div>
                </div>
            </div>


            {
                showModal &&
                <div className="modal-upgrade">
                    <div className="content">
                        <h2>Invierte mas en tu plan - {type.toUpperCase()}</h2>

                        <div className="row">
                            <div className="col">
                                <span>Selecciona un plan de inversion</span>

                                <select className="picker" value={plan} onChange={e => setPlan(e.target.value)}>
                                    <option value="default" disabled>Seleccion tu plan</option>
                                    {
                                        list.map((item, index) => <option value={item.amount} key={index}>{item.amount} {type.toUpperCase()}</option>)
                                    }
                                </select>

                            </div>
                            <div className="col">

                                <span>Ingresa el hash de la transaccion</span>

                                <input
                                    type="text"
                                    value={hash}
                                    onChange={e => setHash(e.target.value)}
                                    className="text-input" />
                            </div>
                        </div>

                        <div className="buttons">
                            <button className="button" disabled={loader} onClick={toggleModal}>Cancelar</button>
                            <button className="button secondary" disabled={loader} onClick={UpGradeExecute}>UPGRADE</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default HeaderDashboard