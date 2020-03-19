import React, { useState } from "react"
import Axios from 'axios'

// Import styles
import "./Register.scss"

// import Assets
import Logo from "../../static/images/logo.png"

// Import Components
import Countries from "../../utils/countries.json"
import ModalTerms from "../../components/Modal/ModalTerms"

const Register = (props) => {

    const { match } = props

    console.log(match.params)

    const [tabActive, setTab] = useState(1)
    const [modal, setModal] = useState(false)

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
    const [wallet, setWallet] = useState('')
    const [investmentPlan, setInvestmentPlan] = useState(0)
    const [usernameSponsor, setUsernameSponsor] = useState(Object.keys(match.params).length === 0 ? match.params.username : '')

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

                {/* <h2>Registro</h2> */}

                {
                    tabActive === 1 &&
                    <div className="tab">
                        <div className="row">
                            <span>Nombre</span>

                            <input value={firstName} onChange={e => setFirstname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Apellido</span>

                            <input value={lastname} onChange={e => setLastname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Correo Electronico</span>

                            <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Pais</span>

                            <select className="picker" value={country} onChange={e => setCountry(console.log(e.target.value))}>
                                {Countries.map(
                                    ({ name }, index) => <option value={index} key={index}>{name}</option>
                                )}
                            </select>
                        </div>

                        <div className="row">
                            <span>Numero telefonico</span>

                            <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="collection-buttons flex-end">
                            <button className="button no-border" onClick={_ => setTab(2)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 2 &&
                    <div className="tab">
                        {
                            Object.keys(match.params).length === 0 &&
                            <div className="row">
                                <span>Usuario Sponsor</span>

                                <input value={usernameSponsor} onChange={e => setUsernameSponsor(e.target.value)} type="text" className="text-input" />
                            </div>
                        }

                        <div className="row">
                            <span>Hash de transaccion</span>

                            <input value={hash} onChange={e => setHash(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Wallet</span>

                            <input value={wallet} onChange={e => setWallet(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Usuario</span>

                            <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span>Contraseña</span>

                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="text-input" />
                        </div>

                        <div className="terms">
                            <span>He leído términos y condiciones</span>

                            <input type="checkbox" value={term} onChange={e => setTerms(e.target.value)} />
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(1)}>Atras</button>
                            <button className="button secondary no-border" onClick={onSubmitInformation}>Enviar</button>
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