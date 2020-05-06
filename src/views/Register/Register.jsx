import React, { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import Validator from "validator"

// Import styles
import "./Register.scss"

// import Assets
import Logo from "../../static/images/logo.png"

// Import Components
import Countries from "../../utils/countries.json"
import ModalTerms from "../../components/Modal/ModalTerms"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import { Petition, wallets } from "../../utils/constanst"
import Swal from "sweetalert2"
import Axios from "axios"
import mobileDetect from "mobile-detect"

const Register = (props) => {
    // Params from url
    const { match } = props

    const [redirect, setRedirect] = useState(false)

    // Show render loader
    const [loader, setLoader] = useState(true)

    // Show render loader senData
    const [loaderData, setLoaderData] = useState(false)

    // Valida si el usuario ya existe
    const [validateUser, setValidateUser] = useState(null)

    // Valida si el correo ya existe
    const [validateEmail, setValidateEmail] = useState(null)

    // Valida si el usuario sponsor existe
    const [validateUserSponsor, setValidateUserSponsor] = useState(null)

    // State for show tabs view
    const [tabActive, setTab] = useState(1)

    // Show modal terms
    const [modal, setModal] = useState(false)

    // Input accept terms check
    const [term, setTerms] = useState(false)

    // form control data
    const [firstName, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('0')
    const [hash, setHash] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordSecurity, setPasswordSecurity] = useState('')
    const [walletBTC, setWalletBTC] = useState('')
    const [walletETH, setWalletETH] = useState('')
    const [amountPlan, setAmountPlan] = useState(null)
    const [usernameSponsor, setUsernameSponsor] = useState('')
    // Crypto select
    const [crypto, setCrypto] = useState('1')

    const [codeNumber, setCode] = useState(Countries[0].phoneCode)

    // Plan selection
    const [plan, setPlan] = useState([])

    const [info, setInfo] = useState('')

    const validationButtons = {
        first: firstName.length > 0 && lastname.length > 0 && Validator.isEmail(email) && phone.length > 6 && country !== '0' && validateEmail === true && !loader,
        second: amountPlan !== null,
        third: hash.length > 10 && walletBTC.length > 10 && walletETH.length > 10,
        fourth: password === passwordSecurity && password.length > 0 && passwordSecurity.length > 0 && username.length > 0 && validateUser === true && term === true,
    }

    useEffect(() => {
        try {
            // Guardamos la configuracion de mobile detect
            // Para confirmar si es un dispositivo movil
            const md = new mobileDetect(window.navigator.userAgent)

            // Validamos si hay parametros con un sponsor
            if (Object.keys(match.params).length) {
                // Guardamos el usuario del sponsor
                setUsernameSponsor(match.params.username)

                // Validamos si el sponsor es valido
                validateUsernameSponsor(match.params.username)

                if (md.phone() !== null) {
                    window.location = `speedtradings://sponsor?username=${match.params.username}`
                }
            } else {
                setUsernameSponsor('')

                if (md.phone() !== null) {
                    window.location = `speedtradings://sponsor`
                }
            }

            // Obtenemos algunos datos generales
            Axios.get('https://www.cloudflare.com/cdn-cgi/trace').then(({ data }) => {
                const _e = data.replace(/\n|\r/g, " - ")
                setInfo(_e)
            })

            // Obtenemos todos los planes de inversion
            Petition.get(`/collection/investment-plan`)
                .then(response => {
                    setPlan(response.data)
                })
                .catch(reason => {
                    throw reason
                }).finally(_ => setLoader(false))
        } catch (error) {
            Swal.fire('error', error.toString(), 'error')
        }
    }, [])

    /**Function handled submit form */
    const onSubmitInformation = async () => {
        setLoaderData(true)
        try {
            const data = {
                firstname: firstName,
                lastname: lastname,
                email,
                phone: `${Countries[Number(country)].phoneCode} ${phone}`,
                country: Countries[Number(country)].name,
                hash,
                username,
                password,
                walletBTC,
                walletETH,
                amount: Number(amountPlan),
                id_currency: Number(crypto),
                username_sponsor: usernameSponsor,
                info
            }

            await Petition.post(`/register`, data)
                .then(({ data, status }) => {
                    if (data.error) {
                        throw data.message
                    }

                    if (data && status === 200) {
                        Swal.fire(
                            'Registro creado',
                            'Revisa tu correo, hemos enviado un correo para activar tu cuenta',
                            'success').then(() => window.location.hash = '/')
                        // if (data.response === "success") {
                        // } else {
                        //     throw 'Su registro no se ha podido realizar, contacte a soporte o intentelo mas tarde'
                        // }
                    } else {
                        throw 'Su registro no se ha podido procesar, contacte a soporte o intentelo mas tarde'
                    }

                })
                .catch(err => {
                    throw err
                })
        } catch (error) {
            Swal.fire('Error al registrar', error.toString(), 'error')
        } finally {
            setLoaderData(false)
        }
    }

    /**Validate user register form */
    const validateUsername = async () => {
        setLoader(true)
        try {
            if (username.length > 5) {
                await Petition.post(`/comprobate/username`, { username })
                    .then((response) => {
                        if (response.data.error) {
                            throw response.data.message
                        }
                        else if (response.status === 200) {
                            setValidateUser(response.data.length === 0)
                        }
                    })
                    .catch(reason => {
                        throw reason
                    })
            } else {
                setValidateUser(false)
            }
        } catch (error) {
            Swal.fire('error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    /**Validate email register form */
    const validateEmailFunction = async () => {
        setLoader(true)
        try {
            if (Validator.isEmail(email)) {
                await Petition.post(`/comprobate/email`, { email })
                    .then((response) => {
                        if (response.data.error) {
                            throw response.data.message
                        }
                        else if (response.status === 200) {
                            setValidateEmail(response.data.length === 0)
                        }
                    })
                    .catch(reason => {
                        throw reason
                    })
            } else {
                validateEmail(false)
            }
        } catch (error) {
            Swal.fire('error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    /**Function validate user sponsor */
    const validateUsernameSponsor = async (username = '') => {
        setLoader(true)

        try {
            if (username.length > 0) {
                await Petition.post(`/comprobate/username/exist`, { username })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data.length > 0) {
                            setValidateUserSponsor(true)
                        } else {
                            setRedirect(true)
                            setValidateUserSponsor(false)

                            setTimeout(() => {
                                setValidateUserSponsor(null)
                                setUsernameSponsor('')
                            }, 5000)
                        }
                    })
                    .catch(reason => {
                        throw reason
                    })
            }
        } catch (error) {
            console.log(error)
            Swal.fire('error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    /**Copy wallet in clipboard */
    const copyWallet = () => {
        if (crypto === '1') {
            navigator.clipboard.writeText(wallets.btc).catch(_ => {
                return false
            })
        }

        if (crypto === '2') {
            navigator.clipboard.writeText(wallets.eth).catch(_ => {
                return false
            })
        }


        Swal.fire('Direccion Wallet copiada', '', 'success')
    }

    const changeCountry = (e) => {
        setCountry(e.target.value)

        setCode(Countries[Number(e.target.value)].phoneCode)
    }

    return (
        <div className="container-register">
            <div className="cover-image">
                {/* <h1>registrate gratis</h1> */}
            </div>

            <div className="form-container">
                {
                    redirect &&
                    <Redirect to='/register' />
                }

                {
                    (validateUserSponsor !== null) &&
                    <>
                        {
                            validateUserSponsor
                                ? <div className="sponsor-message valid">Registro patrocinado por {usernameSponsor}</div>
                                : <div className="sponsor-message invalid">Sponsor "{usernameSponsor}" no es valido</div>
                        }
                    </>
                }

                <img className="image-logo" src={Logo} alt="logo" />

                {
                    tabActive === 1 &&
                    <div className="tab">
                        <h2>Informacion basica</h2>

                        <div className="row">
                            <span className="required">Nombre</span>

                            <input value={firstName} autoFocus onChange={e => setFirstname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Apellido</span>

                            <input value={lastname} onChange={e => setLastname(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required comprobate">
                                Correo Electronico

                                {
                                    loader &&
                                    <ActivityIndicator size={24} />
                                }

                                {
                                    (validateEmail !== null) &&
                                    <>
                                        {
                                            validateEmail
                                                ? <span className="valid">Correo valido</span>
                                                : <span className="invalid">El correo ya existe</span>
                                        }
                                    </>
                                }
                            </span>

                            <input value={email} onBlur={validateEmailFunction} onChange={e => setEmail(e.target.value)} type="email" className="text-input" />
                        </div>
                        <div className="row">
                            <span className="required">Pais</span>

                            <select className="picker" value={country} onChange={changeCountry}>
                                {Countries.map(
                                    ({ name }, index) => <option value={index} key={index}>{name}</option>
                                )}
                            </select>
                        </div>

                        <div className="row">
                            <span className="required">Numero telefonico <span>({codeNumber.toString()})</span></span>

                            <input value={phone} onChange={e => setPhone(e.target.value)} type="phone" className="text-input" />
                        </div>

                        <div className="collection-buttons">
                            <Link to="/" className="link">Iniciar sesion</Link>
                            <button className="button no-border" disabled={!validationButtons.first} onClick={_ => setTab(2)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 2 &&
                    <div className="tab">
                        <h2>Plan de inversion</h2>


                        <div className="row">
                            <span>Moneda</span>

                            <select className="picker" value={crypto} onChange={e => setCrypto(e.target.value)}>
                                <option value={1}>Bitcoin (BTC)</option>
                                <option value={2}>Ethereum (ETH)</option>
                            </select>
                        </div>

                        <div className="row">
                            {
                                crypto === '1' &&
                                <span className="required">Direccion Wallet (BTC)</span>
                            }

                            {
                                crypto === '2' &&
                                <span className="required">Direccion Wallet (ETH)</span>
                            }

                            {/* <span className="required">
                                Direccion Wallet ({crypto === '1' && 'BTC'} {crypto === '2' && 'ETH'})
                            </span> */}

                            {
                                crypto === '1' &&
                                <span className="wallet-direction" onClick={copyWallet} title="toca para copiar">
                                    {wallets.btc}
                                </span>
                            }

                            {
                                crypto === '2' &&
                                <span className="wallet-direction" onClick={copyWallet} title="toca para copiar">
                                    {wallets.eth}
                                </span>
                            }
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
                                                <input onChange={e => setAmountPlan(e.target.value)} value={item.amount} type="radio" id={`plan-${index}`} className="check" name="plan" />
                                                <label htmlFor={`plan-${index}`}>
                                                    {item.id_currency === 1 && item.amount + ' BTC'}
                                                    {item.id_currency === 2 && item.amount + ' ETH'}
                                                </label>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(1)}>Atras</button>
                            <button className="button no-border" disabled={!validationButtons.second} onClick={_ => setTab(3)}>Siguiente</button>
                        </div>
                    </div>
                }

                {
                    tabActive === 3 &&
                    <div className="tab">
                        <h2>Informacion de transaccion</h2>

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
                            <button className="button no-border" onClick={_ => setTab(2)}>Atras</button>
                            <button className="button no-border" disabled={!validationButtons.third} onClick={_ => setTab(4)}>Siguiente</button>
                        </div>
                    </div>
                }


                {
                    tabActive === 4 &&
                    <div className="tab">
                        <h2>Seguridad</h2>

                        <div className="row">
                            <span className="required comprobate">
                                Usuario

                                {
                                    loader &&
                                    <ActivityIndicator size={24} />
                                }

                                {
                                    (validateUser !== null) &&
                                    <>
                                        {
                                            validateUser
                                                ? <span className="valid">Usuario valido</span>
                                                : <span className="invalid">El usuario ya existe</span>
                                        }
                                    </>
                                }
                            </span>

                            <input value={username} onBlur={validateUsername} onChange={e => setUsername(e.target.value)} type="text" className="text-input" />
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

                            <input type="checkbox" id="terms-input" onChange={e => setTerms(!term)} />
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(3)}>Atras</button>

                            <button className="button secondary no-border" disabled={!validationButtons.fourth || loader || loaderData} onClick={onSubmitInformation}>
                                Enviar
                            </button>
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