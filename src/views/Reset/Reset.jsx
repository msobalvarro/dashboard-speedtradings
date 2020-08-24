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
    code: "",

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

            const { code } = state

            // validamos todos los codigos
            if (code.trim().length !== 6) {
                throw String("Pin incorrecto, intente de nuevo")
            }

            // validamos si el pin tiene un formato correcto
            if (!validator.isInt(code)) {
                throw String("Formato de PIN no es correcto")
            }

            // validamos si el capctha es correcto
            if (state.verifyCaptcha.length === 0) {
                throw String("Verifique el reCaptcha")
            }

            // creamos el datos que enviaremos del server
            const dataSend = {
                pin: code,
                password: state.password,
                "g-recaptcha-response": state.verifyCaptcha
            }

            // Ejecutamos la peticion para generar el pin
            const { data } = await Petition.post("/reset-password/pin", dataSend, {
                params: {
                    secret: state.verifyCaptcha
                }
            })

            // verificamos si hay error en el server
            if (data.error) {
                throw data.message
            }

            // verificamos si todo esta correcto
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

            <div className="content">
                <img className="logo" src={logo} alt="logo" />

                {
                    !showPassword &&
                    <>
                        {
                            !writeCode &&
                            <>
                                <h3>Escribe tu correo SpeedTradings</h3>

                                <div className="row code">
                                    <input
                                        value={state.email} 
                                        onChange={e => dispatch({ type: "email", payload: e.target.value })}
                                        type="email"
                                        placeholder="Correo electrónico SpeedTradings"
                                        autoFocus
                                        className="text-input" />

                                </div>

                                <div className="row buttons">
                                    {
                                        !state.loader &&
                                        <>
                                            <a href="#" onClick={onWrite} className="write">Escribir PIN de seguridad</a>

                                            <button className="button" disabled={state.loader} onClick={generateCode}>Enviar PIN</button>
                                        </>
                                    }

                                    {
                                        state.loader &&
                                        <ActivityIndicator size={64} />
                                    }
                                </div>

                                <p>
                                    Para que todo este seguro, enviaremos un PIN de seguridad a tu correo electrónico.

                                    Ten en cuenta que si ya tienes un Pin de seguridad tienes que escribirlo ya que no podrás volverlo a solicitar.
                                </p>
                            </>
                        }

                        {
                            writeCode &&
                            <>
                                <h3>Escribe el PIN de seguridad</h3>

                                <div className="row code">
                                    <input
                                        value={state.code}
                                        onChange={e => dispatch({ type: "code", payload: e.target.value })}
                                        className="text-input code"
                                        maxLength={6}
                                        type="text" 
                                        autoFocus />
                                </div>

                                {
                                    state.loader &&
                                    <ActivityIndicator size={64} />
                                }

                                {
                                    !state.loader &&
                                    <div className="row buttons">
                                        <a href="#" onClick={onWriteEmail} className="write">Ingresar correo</a>

                                        <button onClick={_ => setShowPassword(true)} className="button">Siguiente</button>
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

                                <button disabled={state.password === "" || state.password !== state.otherPassword} onClick={sendSecurityCode} className="button secondary">Finalizar</button>
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default Reset