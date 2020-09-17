import React, { useState, useEffect, useReducer } from "react"

// Redux Storage
import reduxStorage from "../../store/store"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import ActivityIndicator from "../../components/ActivityIndicator/Activityindicator"

// Import Assets
import "./Profile.scss"
import ImagePlaceholder from "../../static/images/profile/placeholder-profile.jpg"
import { Petition, setStorage } from "../../utils/constanst"
import Swal from "sweetalert2"
import { SETSTORAGE } from "../../store/ActionTypes"
import moment from "moment"

/**Estado incial de storage de REACT */
const initialState = {
    // Estado que indica si las wallets y user coinbase es editable
    editWallets: false,

    // Estado que almacena la direccion wallet
    walletBTC: "",
    walletETH: "",

    // Initial state BTC/ETH/Username Coinbase
    intialBTC: "",
    intialETH: "",

    // Password confirm
    password: "",
}


/**Funcion que ejecuta el storage de REACT */
const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const Profile = () => {
    const { globalStorage } = reduxStorage.getState()

    // Estado que almacena si se muestra la ventana de confirmacion (ingrese password)
    const [showConfirm, setShowConfirm] = useState(false)

    // Estado que representa si hay un loader
    const [loader, setLoader] = useState(false)

    // Estado de los campos a editar
    const [state, dispatch] = useReducer(reducer, initialState)

    const [info, setInfo] = useState(null)

    /**Metodo que se ejecuta cuando cancela la edicion de wallet y usuario coinbase */
    const cancelEditWallet = () => {
        dispatch({ type: "editWallets", payload: false })

        // Reseteamos todos los datos por defecto
        dispatch({ type: "walletBTC", payload: state.intialBTC })
        dispatch({ type: "walletETH", payload: state.intialETH })
    }

    /**Metodo que se ejecuta cuando las wallets y user coinbase sean editables */
    const onEditinWallet = () => {
        dispatch({ type: "editWallets", payload: true })
    }

    /**Meotodo que se ejecuta para actualizar los datos despues de escribir password */
    const onChangeWallet = async () => {

        try {
            setLoader(true)

            if (state.password.length === "") {
                throw String("Escribe tu Contraseña para continuar")
            }

            // id_user, btc, eth, username, password, email
            const dataSend = {
                id_user: globalStorage.id_user,
                email: globalStorage.email,
                btc: state.walletBTC,
                eth: state.walletETH,
                password: state.password,
            }

            await Petition.post("/profile/update-wallet", dataSend, {
                headers: {
                    "x-auth-token": globalStorage.token
                }
            }).then(async ({ data }) => {
                if (data.error) {
                    throw String(data.message)
                } else {
                    // Hacemos el dispatch al store de redux
                    reduxStorage.dispatch({ type: SETSTORAGE, payload: data })

                    // Actualizamos el localstorage
                    setStorage(data)

                    // Limpiamos el campo password
                    dispatch({ type: "password", payload: "" })

                    // Reconfiguramos los datos de redux
                    await initialConfig()

                    // Reseteamos todo el formulario
                    dispatch({ type: "editWallets", payload: false })

                    // Cerramos la ventana de confirmacion
                    setShowConfirm(false)

                    Swal.fire("Speed Tradings", "Tus datos se han actualizado", "success")
                }
            })

            dispatch({ type: "password", payload: "" })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "error")
        } finally {
            setLoader(false)
        }
    }

    /**Metodo que se ejecuta cuando el usuario hace clic atras en confirmacion de password */
    const onCancellEditWallet = () => {
        setShowConfirm(false)
    }

    /**Configuracion inicial del componente */
    const initialConfig = () => {
        try {
            const { globalStorage: updateStorage } = reduxStorage.getState()

            // Initial wallet BTC
            dispatch({ type: "walletBTC", payload: updateStorage.wallet_btc })
            dispatch({ type: "intialBTC", payload: updateStorage.wallet_btc })

            // Initial wallet ETH
            dispatch({ type: "walletETH", payload: updateStorage.wallet_eth })
            dispatch({ type: "intialETH", payload: updateStorage.wallet_eth })

            Petition.get(`/profile/info?id=${globalStorage.id_user}`, {
                headers: {
                    "x-auth-token": globalStorage.token
                }
            }).then(({ data }) => {
                if (data.error) {
                    throw String(data.message)
                } else {
                    setInfo(data)
                }
            })
                .catch(() => {
                    throw String("No se ha podido actualizar tu perfil")
                })
        } catch (error) {
            Swal.fire("Ha ocurrido un error", error, "error")
        }
    }

    useEffect(() => {
        initialConfig()
    }, [])

    return (
        <div className="container-profile">
            <NavigationBar />

            <header className="header-profile">
                <div className="main-row">
                    <div className="col avatar">
                        <img src={ImagePlaceholder} className="avatar" alt="profile" />
                    </div>

                    <div className="col large">
                        <div className="row">
                            <h2 className="full-name">{globalStorage.firstname} {globalStorage.lastname}</h2>
                        </div>

                        <div className="row">
                            <span className="username">@{globalStorage.username}</span>
                        </div>

                        <div className="row info">
                            <div className="item">
                                <div className="ng-row">
                                    <span className="key">Numero de Contacto</span>
                                    <span>{globalStorage.phone}</span>
                                </div>
                            </div>

                            <div className="item">
                                <div className="ng-row">
                                    <span className="key">Pais</span>
                                    <span>{globalStorage.country}</span>
                                </div>
                            </div>

                            {
                                (info !== null) &&
                                <div className="item">
                                    <div className="ng-row">
                                        <span className="key">Primera actividad</span>
                                        <span>{moment(info.start_date).format('MMM. D, YYYY')}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {
                        (info !== null) &&
                        <div className="col">
                            <div className="row">
                                <div className="sub-row">
                                    <span className="key">Rango</span>

                                    {
                                        (info.sponsors >= 0 && info.sponsors <= 14) &&
                                        <span className="value">SILVER</span>
                                    }

                                    {
                                        (info.sponsors >= 15 && info.sponsors <= 29) &&
                                        <span className="value">GOLDEN</span>
                                    }

                                    {
                                        (info.sponsors >= 30 && info.sponsors <= 49) &&
                                        <span className="value">PLATINUM</span>
                                    }

                                    {
                                        (info.sponsors >= 50 && info.sponsors <= 99) &&
                                        <span className="value">DIAMOND</span>
                                    }

                                    {
                                        (info.sponsors >= 100 ) &&
                                        <span className="value">VIP</span>
                                    }
                                </div>

                                <div className="sub-row">
                                    <span className="key">Referidos</span>
                                    <span className="value">{info.sponsors}</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="main-row resalt">
                    <div className="col wallet">
                        <div className="row">
                            <span className="label">Wallet Bitcoin</span>

                            <input
                                value={state.walletBTC}
                                onChange={e => dispatch({ type: "walletBTC", payload: e.target.value })}
                                type="text"
                                className="text-input"
                                disabled={!state.editWallets} />
                        </div>

                        <div className="row">
                            <span className="label">Wallet Ethereum</span>

                            <input
                                value={state.walletETH}
                                onChange={e => dispatch({ type: "walletETH", payload: e.target.value })}
                                type="text"
                                className="text-input"
                                disabled={!state.editWallets} />
                        </div>

                        <div className="buttons">
                            {
                                !state.editWallets &&
                                <button onClick={onEditinWallet} className="button secondary">
                                    Editar
                                </button>
                            }

                            {
                                state.editWallets &&
                                <>
                                    <button onClick={cancelEditWallet} className="button margin">Cancelar</button>
                                    <button className="button secondary" onClick={_ => setShowConfirm(true)}>Actualizar</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </header>

            {
                showConfirm &&
                <div className="modal-password">
                    {
                        loader &&
                        <ActivityIndicator />
                    }

                    {
                        !loader &&
                        <>
                            <div className="row">
                                <span>Escribe tu Contraseña parta continuar</span>

                                <input
                                    value={state.password}
                                    type="password"
                                    autoFocus={true}
                                    onChange={e => dispatch({ type: "password", payload: e.target.value })}
                                    className="text-input" />
                            </div>

                            <div className="buttons">
                                <button className="button margin" onClick={onCancellEditWallet}>Atras</button>
                                <button className="button secondary" onClick={onChangeWallet}>Procesar</button>
                            </div>
                        </>
                    }

                </div>
            }
        </div>
    )
}

export default Profile