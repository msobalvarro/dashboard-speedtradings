import React, { useState, useEffect, useReducer } from "react"
import { Link, Redirect } from "react-router-dom"
import Validator from "validator"

// Import styles
import "./Register.scss"

// Import components
import FilminasSlider from "../../components/FilminasSlider/FilminasSlider"

// import Assets
import Logo from "../../static/images/logo.png"
import AlypayLogo from "../../static/images/alypay-logo.png"

// Import Components
import Countries from "../../utils/countries.json"
import ModalTerms from "../../components/ModalTerms/ModalTerms"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"
import {
    Petition,
    getWallets,
    WithDecimals,
    copyData,
    calculateCryptoPrice,
    calculateCryptoPriceWithoutFee,
    amountMin
} from "../../utils/constanst"
import Swal from "sweetalert2"
import Axios from "axios"
import mobileDetect from "mobile-detect"

const Register = (props) => {
    // Params from url
    const { match } = props

    // Estado que actualiza la direccion url cuando un sponsor no es valido
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

    const [wallets, setWallets] = useState({ btc: null, alypay: null, eth: null })

    // form control data
    const [firstName, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('0')
    const [hash, setHash] = useState('')
    const [emailAirtm, setEmailAirtm] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordSecurity, setPasswordSecurity] = useState('')
    const [walletBTC, setWalletBTC] = useState('')
    const [walletETH, setWalletETH] = useState('')
    const [amountPlan, setAmountPlan] = useState(0)
    const [usernameSponsor, setUsernameSponsor] = useState('')
    const [aproximateAmountAirtm, setAproximateAmount] = useState(0)
    const [showPassword, setShowPassword] = useState(false)

    // Tipo de moneda en la inversion btc/eth
    const [crypto, setCrypto] = useState(1)

    // Guarda el codigo de pais para numero telefonico
    const [codeNumber, setCode] = useState(Countries[0].phoneCode)

    // Captura el valor ingresado por el usuario en el campo del monto del plan
    const [userInput, setUserInput] = useState('')

    // Guarda la informacion de usuario
    const [info, setInfo] = useState('')

    // Estado que indica si el pago es Airtm
    const [airtm, setAirtm] = useState(false)

    // Estado que indica si el pago es Alypay
    const [alypay, setAlypay] = useState(true)

    // Estado que indica el valor del check de wallet alypay
    const [isWalletAlypay, setIsWalletAlypay] = useState(true)

    // Estado que indica el tipo de método de pago seleccionado
    const [paidMethod, setPaidMethod] = useState(2)

    // Estado que guarda los precios y detalles de la coinmarketcap
    const [cryptoPrices, setCryptoPrices] = useState({ BTC: null, ETH: null })

    // Estado para controlar la leyenda del monto en dolares
    const [amountDollar, setAmountDollar] = useState(0)

    // Hook para forzar un renderizado
    const [__, forceUpdate] = useReducer((x) => x + 1, 0)

    /**Coleccion de botones */
    const validationButtons = {
        first: firstName.length > 0 && lastname.length > 0 && Validator.isEmail(email) && phone.length > 6 && country !== '0' && validateEmail === true && !loader && password === passwordSecurity && password.length > 0 && passwordSecurity.length > 0 && username.length > 0 && validateUser === true,

        second: amountPlan !== null &&
            ((crypto === 1) ? amountPlan >= amountMin.btc : amountPlan >= amountMin.eth) &&
            hash.length > 10 &&
            walletBTC.length > 10 &&
            walletETH.length > 10 &&
            (airtm ? Validator.isEmail(emailAirtm) : true) &&
            term === true,
    }

    /**Function handled submit form */
    const onSubmitInformation = async () => {
        setLoaderData(true)
        try {

            // Validamos que si el usuario ha seleccionado un plan
            if (amountPlan === 0) {
                throw String('Seleccione un plan de inversion')
            }

            const dataSend = {
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
                emailAirtm,
                airtm,
                alypay,
                alyWallet: true,
                aproximateAmountAirtm,
                amount: Number(amountPlan),
                id_currency: Number(crypto),
                username_sponsor: usernameSponsor,
                info
            }

            const { data } = await Petition.post(`/register`, dataSend)

            if (data.error) {
                throw String(data.message)
            }

            if (data.response === "success") {
                Swal.fire(
                    'Registro creado',
                    'Revisa tu correo, hemos enviado un correo para activar tu cuenta',
                    'success').then(() => window.location.hash = '/')
            } else {
                throw String('Su registro no se ha podido procesar, contacte a soporte o intentelo mas tarde')
            }

        } catch (error) {
            Swal.fire("", error.toString(), "warning")
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
            if (email.trim() !== "") {
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
                    setValidateEmail(false)
                }
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
                const { data } = await Petition.post(`/comprobate/username/exist`, { username })

                if (data.length > 0) {
                    setValidateUserSponsor(true)
                } else {
                    setRedirect(true)
                    setValidateUserSponsor(false)

                    setTimeout(() => {
                        setValidateUserSponsor(null)
                        setUsernameSponsor('')
                    }, 5000)
                }
            }
        } catch (error) {
            Swal.fire('error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    /**Metodo que ejecuta cuando el usuario cambia de ciudad */
    const changeCountry = (e) => {
        setCountry(e.target.value)

        setCode(Countries[Number(e.target.value)].phoneCode)
    }

    /** Método para capturar el monto del plan de inversión ingresado por el usuario */
    const onChangeAmountPlan = (e) => {
        let { value } = e.target

        // Expresiones regulares para comprobar que la entrada del monto sea válida
        const floatRegex = /^(?:\d{1,})(?:\.\d{1,})?$/
        const floatRegexStart = /^(?:\d{1,})(?:\.)?$/

        /**Constante que define el precio de moneda seleccionada */
        const cryptoPrice = cryptoPrices.BTC !== null
            ? crypto === 1
                ? cryptoPrices.BTC.quote.USD.price
                : cryptoPrices.ETH.quote.USD.price
            : 0

        // Verificamos si valor ingresado no contiene letras o símbolos no permitidos
        if (!value.length || floatRegex.test(value) || floatRegexStart.test(value)) {
            setUserInput(value)

            value = (value.length) ? value : '0'
            let _amountDollar = 0

            // Verificamos si el usuario pagara con transaccion Airtm
            if (airtm) {
                // Sacamos el monto (USD) aproximado en el momento
                _amountDollar = (value !== '0') ? calculateCryptoPrice(cryptoPrice, parseFloat(value)) : 0

                setAproximateAmount(_amountDollar)
                setAmountPlan(parseFloat(value))
            } else {
                // Sacamos el monto (USD) aproximado en el momento sin impuestos
                _amountDollar = calculateCryptoPriceWithoutFee(cryptoPrice, parseFloat(value))

                setAmountPlan(parseFloat(value))
            }

            setAmountDollar(_amountDollar)
        }

        forceUpdate()
    }

    /** Método para verificar si el monto de inversión ingresado es mayor o igual al minimo permitido */
    const onCheckAmountMinValue = _ => {
        const checker = (crypto === 1) ? !(amountPlan >= amountMin.btc) : !(amountPlan >= amountMin.eth)

        if (checker) {
            Swal.fire("", "Ingrese un plan de inversión mayor o igual al mínimo permitido", "warning")
        }
    }

    /**Metodo que se ejecuta cuando el usuario cambia el método de pago */
    const onChangePaidMethod = (e) => {
        const { value } = e.target

        setUserInput('')
        setPaidMethod(parseInt(value))

        switch (value) {
            // Método de pago alypay
            case "2":
                setAirtm(false)
                setAlypay(true)
                break

            // Método de pago airtm
            case "1":
                setAirtm(true)
                setAlypay(false)
                break

            // Método de pago de criptomoneda
            default:
                setAirtm(false)
                setAlypay(false)
                break
        }

        forceUpdate()
    }

    /**Metodo que muestra la ventana modal con terminos y condiciones */
    const showTermsModal = (e) => {
        e.preventDefault()

        setModal(true)
    }

    /**
     * Obtiene los precios de la coinmarketcap
     * */
    const getAllPrices = async () => {
        setLoader(true)

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

        setLoader(false)
        forceUpdate()
    }

    useEffect(() => {
        // Se obtinen los has de las wallets
        getWallets(setWallets)
        forceUpdate()
    }, [])

    useEffect(() => {
        if (tabActive === 2) {
            getAllPrices()
        }

    }, [tabActive])

    // Cuando cambia el tipo de moneda, se recalcula el valor en $ según el valor del input del monto
    useEffect(() => {
        onChangeAmountPlan({ target: { value: userInput } })
    }, [crypto])

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
                // quitamos los espacios 
                const _e = data.replace(/\n|\r/g, " - ")
                setInfo(_e)
            })

        } catch (error) {
            Swal.fire('error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }, [])

    return (
        <div className="container-register">
            <input type="hidden" value={__} />
            <div className="cover-image">
                <FilminasSlider />
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

                <div className="row-logos">
                    <img className="image-logo" src={Logo} alt="logo" />
                    {
                        tabActive === 2 && isWalletAlypay &&
                        <img src={AlypayLogo} alt="" className="alypay-logo" />
                    }
                </div>

                {
                    tabActive === 1 &&
                    <div className="tab">
                        <h2>Informacion basica</h2>

                        <div className="row-group">
                            <div className="col">
                                <span className="required">Nombre</span>

                                <input value={firstName} autoFocus onChange={e => setFirstname(e.target.value)} type="text" className="text-input" />
                            </div>
                            <div className="col">
                                <span className="required">Apellido</span>

                                <input value={lastname} onChange={e => setLastname(e.target.value)} type="text" className="text-input" />
                            </div>
                        </div>

                        <div className="row">
                            <span className="required comprobate">
                                Correo Electrónico

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

                        <div className="row-group">
                            <div className="col country-field">
                                <span className="required">País</span>

                                <select className="picker" value={country} onChange={changeCountry}>
                                    {Countries.map(
                                        ({ name }, index) => <option value={index} key={index}>{name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="col telephone-field">
                                <span className="required">Numero telefónico <span>({codeNumber.toString()})</span></span>

                                <input value={phone} onChange={e => setPhone(e.target.value)} type="phone" className="text-input" />
                            </div>
                        </div>

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

                        <div className="row-group">
                            <div className="col">
                                <span className="required">Contraseña</span>

                                <input value={password} onChange={e => setPassword(e.target.value)} type={(!showPassword) ? 'password' : 'text'} className="text-input" />
                            </div>

                            <div className="col">
                                <span className="required">Confirmar Contraseña</span>

                                <input value={passwordSecurity} onChange={e => setPasswordSecurity(e.target.value)} type={(!showPassword) ? 'password' : 'text'} className="text-input" />
                            </div>
                        </div>

                        <div className="terms">
                            <label htmlFor="showpassword-check">Mostrar Contraseñas</label>

                            <input type="checkbox" checked={showPassword} id="showpassword-check" onChange={e => setShowPassword(!showPassword)} />
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
                            {
                                !airtm &&
                                <>
                                    {
                                        crypto === 1 &&
                                        <span className="required">Direccion Wallet (BTC)</span>
                                    }

                                    {
                                        crypto === 2 &&
                                        <span className="required">Direccion Wallet (ETH)</span>
                                    }

                                    {
                                        crypto === 1 &&
                                        <span
                                            className="wallet-direction"
                                            onClick={_ => copyData(
                                                wallets.btc !== null && wallets.alypay !== null
                                                    ? !alypay ? wallets.btc : wallets.alypay.btc
                                                    : ''
                                            )}
                                            title="toca para copiar">
                                            {
                                                wallets.btc !== null && wallets.alypay !== null
                                                    ? !alypay ? wallets.btc : wallets.alypay.btc
                                                    : 'Cargando wallet...'
                                            }
                                        </span>
                                    }

                                    {
                                        crypto === 2 &&
                                        <span
                                            className="wallet-direction"
                                            onClick={_ => copyData(
                                                wallets.eth !== null && wallets.alypay !== null
                                                    ? !alypay ? wallets.eth : wallets.alypay.eth
                                                    : ''
                                            )}
                                            title="toca para copiar">
                                            {
                                                wallets.eth !== null && wallets.alypay !== null
                                                    ? !alypay ? wallets.eth : wallets.alypay.eth
                                                    : 'Cargando wallet...'
                                            }
                                        </span>
                                    }
                                </>
                            }

                            {
                                airtm &&
                                <>
                                    <span className="required">Correo Airtm</span>

                                    <span className="wallet-direction" onClick={_ => copyData(wallets.airtm)} title="toca para copiar">
                                        {wallets.airtm}
                                    </span>
                                </>
                            }

                        </div>

                        <div className="row-group">
                            <div className="col">
                                <span>Moneda</span>

                                <select className="picker" value={crypto} onChange={e => setCrypto(parseInt(e.target.value))}>
                                    <option value={1}>Bitcoin (BTC)</option>
                                    <option value={2}>Ethereum (ETH)</option>
                                </select>
                            </div>

                            <div className="col">
                                <label htmlFor="check-airtm">Tipo de Pago</label>

                                <select className="picker" value={paidMethod} name="paidMethod" onChange={onChangePaidMethod}>
                                    <option value={2}>AlyPay</option>
                                    <option value={1}>Airtm</option>
                                    <option value={0}>Criptomoneda</option>
                                </select>
                            </div>
                        </div>

                        <div className="row-group amount-plan">
                            <div className="col telephone-field">
                                {
                                    crypto === 1 &&
                                    <span className="required">Monto plan de inversion(BTC)</span>
                                }

                                {
                                    crypto === 2 &&
                                    <span className="required">Monto plan de inversion(ETH)</span>
                                }

                                <input
                                    value={userInput}
                                    type="text"
                                    onChange={onChangeAmountPlan}
                                    onBlur={onCheckAmountMinValue}
                                    className="text-input" />
                            </div>

                            <div className="col dollar-amount">
                                <span>$ {WithDecimals(amountDollar)}</span>
                            </div>
                        </div>

                        <div className="row min-amount">
                            {
                                crypto === 1 &&
                                <span>Monto mínimo de inversion: {amountMin.btc} BTC</span>
                            }

                            {
                                crypto === 2 &&
                                <span>Monto mínimo de inversion: {amountMin.eth} ETH</span>
                            }
                        </div>

                        <div className="row">
                            {
                                airtm &&
                                <span className="required">Id de manipulacion Airtm</span>
                            }

                            {
                                !airtm &&
                                <span className="required">Hash de transaccion</span>
                            }

                            <input value={hash} onChange={e => setHash(e.target.value)} type="text" className="text-input" />
                        </div>

                        {
                            airtm &&
                            <div className="row">
                                <span className="required">Correo de transaccion Airtm</span>
                                <input value={emailAirtm} onChange={e => setEmailAirtm(e.target.value)} type="text" className="text-input" />
                            </div>
                        }

                        <div className="row">
                            <span className="required">Direccion Wallet AlyPay BTC</span>
                            <input value={walletBTC} onChange={e => setWalletBTC(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="row">
                            <span className="required">Direccion Wallet AlyPay ETH</span>
                            <input value={walletETH} onChange={e => setWalletETH(e.target.value)} type="text" className="text-input" />
                        </div>

                        <div className="terms">
                            <label htmlFor="terms-input">He leído términos y condiciones</label>

                            <input type="checkbox" checked={term} id="terms-input" onChange={_ => setTerms(!term)} />
                        </div>

                        <div className="collection-buttons">
                            <button className="button no-border" onClick={_ => setTab(1)}>Atras</button>
                            <button className="button secondary no-border" disabled={!validationButtons.second || loader || loaderData} onClick={onSubmitInformation}>
                                Enviar
                            </button>
                        </div>
                    </div>
                }

                <div className="read-term">
                    <a href="#" className="view-terms" onClick={showTermsModal}>
                        Terminos y condiciones
                    </a>
                </div>
            </div>

            <ModalTerms isVisible={modal} onClose={_ => setModal(false)} />
        </div>
    )
}

export default Register