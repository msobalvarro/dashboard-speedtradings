import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Axios from 'axios'

// Import styles
import "./Register.scss"

// import Assets
import Logo from "../../static/images/logo.png"

// Import Components
import Countries from "../../utils/countries.json"
import ModalTerms from "../../components/Modal/ModalTerms"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

import { urlServer, Toast } from "../../utils/constanst"

const Register = (props) => {

    // Params from url
    const { match } = props

    // Show render loader
    const [loader, setLoader] = useState(true)

    // State for show tabs view
    const [tabActive, setTab] = useState(3)

    // Show modal terms
    const [modal, setModal] = useState(false)

    // Input accept terms check
    const [term, setTerms] = useState(false)

    // form control data
    const [firstName, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('')
    const [hash, setHash] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordSecurity, setPasswordSecurity] = useState('')
    const [walletBTC, setWalletBTC] = useState('')
    const [walletETH, setWalletETH] = useState('')
    const [investmentPlan, setInvestmentPlan] = useState(0)
    const [usernameSponsor, setUsernameSponsor] = useState(Object.keys(match.params).length === 0 ? match.params.username : '')

    // Crypto select
    const [crypto, setCrypto] = useState('1')

    const [plan, setPlan] = useState([])

    useEffect(() => {
        try {
            Axios.get(`${urlServer}/collection/investment-plan`)
                .then(response => {
                    console.log(response.data)
                    setPlan(response.data)
                })
                .catch(reason => {
                    console.log(reason)

                    throw reason
                }).finally(_ => setLoader(false))
        } catch (error) {
            Toast('error', error)
        }
    }, [])

    const onSubmitInformation = () => {
        const data = {

        }
    }

    return (
        <div className="container-register">
            <div className="cover-image">
                {/* <h1>registrate gratis</h1> */}
            </div>

            <div className="form-container">
                <img className="image-logo" src={Logo} alt="logo" />

                {/* <ActivityIndicator /> */}

                {/* <h2>Registro</h2> */}

                {
                    tabActive === 1 &&
                    <div className="tab">
                        <h2>Informacion basica</h2>

                        <div className="row">
                            <span className="required">Nombre</span>

                            <input value={firstName} onChange={e => setFirstname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Apellido</span>

                            <input value={lastname} onChange={e => setLastname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Correo Electronico</span>

                            <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Pais</span>

                            <select className="picker" value={country} onChange={e => setCountry(console.log(e.target.value))}>
                                {Countries.map(
                                    ({ name }, index) => <option value={index} key={index}>{name}</option>
                                )}
                            </select>
                        </div>

                        <div className="row">
                            <span className="required">Numero telefonico</span>

                            <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="collection-buttons">
                            <Link to="/" className="link">Iniciar sesion</Link>
                            <button className="button no-border" onClick={_ => setTab(2)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 2 &&
                    <div className="tab">
                        <h2>Informacion de transaccion</h2>

                        {
                            Object.keys(match.params).length === 0 &&
                            <div className="row">
                                <span>Usuario Sponsor</span>

                                <input value={usernameSponsor} onChange={e => setUsernameSponsor(e.target.value)} type="text" className="text-input" />
                            </div>
                        }

                        <div className="row">
                            <span className="required">Hash de transaccion</span>

                            <input value={hash} onChange={e => setHash(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Direccion Wallet BTC</span>

                            <input value={walletBTC} onChange={e => setWalletBTC(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Direccion Wallet ETH</span>

                            <input value={walletETH} onChange={e => setWalletETH(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(1)}>Atras</button>
                            <button className="button no-border" onClick={_ => setTab(3)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 3 &&
                    <div className="tab">
                        <h2>Plan de inversion</h2>


                        <div className="row">
                            <span className="required">Moneda</span>

                            <select className="picker" value={crypto} onChange={e => setCrypto(e.target.value)}>
                                <option value={1}>Bitcoin (BTC)</option>
                                <option value={2}>Ethereum (ETH)</option>
                            </select>
                        </div>

                        <div className="row investment-plan">
                            <span className="required">Plan de inversion</span>

                            <div className="plan">
                                {
                                    (loader && plan.length === 0) &&

                                    <ActivityIndicator />
                                }

                                {plan.map((item, index) => {
                                    if (item.id_currency === Number(crypto)) {
                                        return (
                                            <div className="element" key={index}>
                                                <input onChange={e => console.log(e.target.value)} value={item.id} type="radio" id={`plan-${index}`} className="check" name="plan" />
                                                <label htmlFor={`plan-${index}`}>
                                                    {item.amount}
                                                    {item.id_currency === 1 && ' BTC'}
                                                    {item.id_currency === 2 && ' ETH'}
                                                </label>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(2)}>Atras</button>
                            <button className="button no-border" onClick={_ => setTab(4)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 4 &&
                    <div className="tab">
                        <h2>Seguridad</h2>

                        <div className="row">
                            <span className="required">Usuario</span>

                            <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Contraseña</span>

                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Confirmar Contraseña</span>

                            <input value={passwordSecurity} onChange={e => setPasswordSecurity(e.target.value)} type="password" className="text-input" />
                        </div>

                        <div className="terms">
                            <label htmlFor="terms-input">He leído términos y condiciones</label>

                            <input type="checkbox" value={term} id="terms-input" onChange={e => setTerms(e.target.value)} />
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(3)}>Atras</button>
                            <button className="button secondary no-border" disabled={password !== passwordSecurity || password === ""} onClick={onSubmitInformation}>Enviar</button>
                        </div>
                    </div>
                }

                <div className="read-term">
                    <a href="#" className="view-terms" onClick={e => {
                        e.preventDefault()

                        setModal(true)
                    }}>
                        Terminos y condiciones
                    </a>
                </div>
            </div>

            <ModalTerms isVisible={modal} onClose={e => setModal(false)} />
        </div>
    )
}

export default Register