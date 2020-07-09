import React, { useState, useReducer } from "react"

// Import Components
import Recaptcha from "react-recaptcha"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

// Import functions and constants
import { siteKeyreCaptcha, Petition } from "../../utils/constanst"
import validator from "validator"

// import assets and styles
import "./Reset.scss"
import logo from "../../static/images/logo.png"
import Swal from "sweetalert2"

const initialState = {
    codeOne: "",
    codeTwo: "",
    codeThree: "",
    codeFour: "",
    codeFive: "",
    codeSix: "",

    verifyCaptcha: "",

    // Email form
    email: "",

    password: "",
    otherPassword: "",

    // Loader component
    loader: false,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}


const Reset = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Estado que indica la vista final
    const [showPassword, setShowPassword] = useState(false)

    // Estado que indica que muestra opcion de escribir codigo
    const [writeCode, setWrite] = useState(false)

    /**
     * Metodo que se ejecuta cuando el usuario quiere escribir el codifo de seguridad
     * @param {*} e 
     */
    const onWrite = (e) => {
        e.preventDefault()

        setWrite(true)
    }

    /**
     * Metodo quer se ejecuta cuando el usuario decide cambiar 
     * 
     * @param {*} e 
     */
    const onWriteEmail = (e) => {
        e.preventDefault()

        setWrite(false)
    }


    /**
     * Metodo que envia la peticion para genera un codigo
     */
    const generateCode = async () => {
        try {
            dispatch({ type: "loader", payload: true })

            const { data } = await Petition.post("/reset-password/generate", { email: state.email })

            if (data.error) {
                throw data.message
            }

            if (data.response === "success") {
                Swal.fire("Pin generado", "Revise su correo para obtener el codigo de seguridad", "success").then(() => setWrite(true))
            } else {
                throw "El pin no se ha podido generar, contacte a soporte"
            }
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            dispatch({ type: "loader", payload: false })
        }
    }

    /**
     * Metodo q
     */
    const sendSecurityCode = async () => {
        try {
            dispatch({ type: "loader", payload: true })

            const { codeOne, codeTwo, codeThree, codeFour, codeFive, codeSix } = state

            if (codeOne.trim() === "" || codeTwo.trim() === "" || codeThree.trim() === "" || codeFour.trim() === "" || codeFive.trim() === "" || codeSix.trim() === "") {
                throw "Pin incorrecto, intente de nuevo"
            }

            const pin = (codeOne + codeTwo + codeThree + codeFour + codeFive + codeSix)

            if (!validator.isInt(pin)) {
                throw "Formato de PIN no es correcto"
            }

            if (state.verifyCaptcha.length === 0) {
                throw "Verifique el reCaptcha"
            }

            const dataSend = {
                pin,
                password: state.password,
                "g-recaptcha-response": state.verifyCaptcha
            }

            const { data } = await Petition.post("/reset-password/pin", dataSend, {
                params: {
                    secret: state.verifyCaptcha
                }
            })

            if (data.error) {
                throw data.message
            }

            if (data.response === "success") {
                Swal.fire("Listo", "Tu contraseña se ha actualizado", "success")
                    .then(_ => {
                        window.location.hash = "#/"
                    })
            }

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            dispatch({ type: "loader", payload: false })
        }
    }

    return (
        <div className="container-reset">
            <img className="logo" src={logo} alt="logo" />

            {
                !showPassword &&
                <>
                    {
                        !writeCode &&
                        <>
                            <h1>Hola, para que todo este seguro, enviaremos un pin de seguridad a tu correo electrónico</h1>

                            <div className="row">
                                <span className="legend">Correo electrónico</span>
                                <input
                                    value={state.email} onChange={e => dispatch({ type: "email", payload: e.target.value })}
                                    type="email"
                                    className="text-input" />

                            </div>

                            <div className="row buttons">
                                {
                                    validator.isEmail(state.email) &&
                                    <>
                                        {
                                            !state.loader &&
                                            <a href="#" onClick={onWrite} className="write">Escribir código de seguridad</a>
                                        }

                                        {
                                            state.loader
                                                ? <ActivityIndicator size={64} />
                                                : <button className="button" disabled={state.loader} onClick={generateCode}>Enviar codigo</button>
                                        }

                                    </>
                                }
                            </div>
                        </>
                    }

                    {
                        writeCode &&
                        <>
                            <h3>Escribe el codigo de verificación</h3>

                            <div className="row code">
                                <input
                                    value={state.codeOne}
                                    onChange={e => dispatch({ type: "codeOne", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" autoFocus />

                                <input
                                    value={state.codeTwo}
                                    onChange={e => dispatch({ type: "codeTwo", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" />

                                <input
                                    value={state.codeThree}
                                    onChange={e => dispatch({ type: "codeThree", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" />

                                <input
                                    value={state.codeFour}
                                    onChange={e => dispatch({ type: "codeFour", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" />

                                <input
                                    value={state.codeFive}
                                    onChange={e => dispatch({ type: "codeFive", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" />

                                <input
                                    value={state.codeSix}
                                    onChange={e => dispatch({ type: "codeSix", payload: e.target.value })}
                                    className="text-input"
                                    maxLength={1}
                                    type="text" />
                            </div>

                            {
                                state.loader &&
                                <ActivityIndicator size={64} />
                            }

                            {
                                !state.loader &&
                                <div className="row buttons">
                                    <a href="#" onClick={onWriteEmail} className="write">Ingresar correo</a>

                                    <button onClick={_ => setShowPassword(true)} className="button">Enviar codigo</button>
                                </div>
                            }
                        </>
                    }
                </>
            }

            {
                showPassword &&
                <>
                    <div className="row password">
                        <input className="text-input" placeholder="Escribe tu contraseña" type="password" value={state.password} onChange={e => dispatch({ type: "password", payload: e.target.value })} />

                        <input className="text-input" placeholder="Confirma tu contraseña" type="password" value={state.otherPassword} onChange={e => dispatch({ type: "otherPassword", payload: e.target.value })} />
                    </div>

                    <div className="row captcha">
                        <Recaptcha
                            size={128}
                            verifyCallback={payload => dispatch({ type: "verifyCaptcha", payload })} sitekey={siteKeyreCaptcha} />
                    </div>


                    {
                        state.loader &&
                        <ActivityIndicator size={64} />
                    }

                    {
                        !state.loader &&
                        <div className="row buttons">
                            <button onClick={_ => setShowPassword(false)} className="button">Cancelar</button>

                            <button disabled={state.password === "" && state.password !== state.otherPassword} onClick={sendSecurityCode} className="button secondary">Finalizar</button>
                        </div>
                    }
                </>
            }

        </div>
    )
}

export default Reset