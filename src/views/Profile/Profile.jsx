import React, { useState, useEffect, useReducer } from "react"

// Redux Storage
import reduxStorage from "../../store/store"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"

// Import Assets
import "./Profile.scss"
import ImagePlaceholder from "../../static/images/profile/placeholder-profile.jpg"
import Planet from "../../static/images/profile/planet.png"

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
    intialCOINBASE: "",

    // Estado que almacena el usuario Coinbase
    userCoinbase: "",
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
    console.log(globalStorage)

    const [state, dispatch] = useReducer(reducer, initialState)

    /**Metodo que se ejecuta cuando cancela la edicion de wallet y usuario coinbase */
    const cancelEditWallet = () => {
        dispatch({ type: "editWallets", payload: false })

        // Reseteamos todos los datos por defecto
        dispatch({ type: "walletBTC", payload: state.intialBTC })
        dispatch({ type: "walletETH", payload: state.intialETH })
        dispatch({ type: "userCoinbase", payload: state.intialCOINBASE })
    }

    /**Metodo que se ejecuta cuando las wallets y user coinbase sean editables */
    const onEditinWallet = () => {
        dispatch({ type: "editWallets", payload: true })
    }

    useEffect(() => {

        // Initial wallet BTC
        dispatch({ type: "walletBTC", payload: globalStorage.wallet_btc })
        dispatch({ type: "intialBTC", payload: globalStorage.wallet_btc })

        // Initial wallet ETH
        dispatch({ type: "walletETH", payload: globalStorage.wallet_eth })
        dispatch({ type: "intialETH", payload: globalStorage.wallet_eth })

        // Initial State coinbase username
        dispatch({ type: "intialCOINBASE", payload: globalStorage.user_coinbase !== null ? globalStorage.user_coinbase : "" })
        dispatch({ type: "userCoinbase", payload: globalStorage.user_coinbase !== null ? globalStorage.user_coinbase : "" })

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
                                <img src={Planet} alt="" />

                                <div className="ng-row">
                                    <span>{globalStorage.country}</span>
                                    <span>{globalStorage.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">

                        <div className="row">
                            <div className="sub-row">
                                <span className="key">Rango</span>
                                <span className="value">cobre</span>
                            </div>

                            <div className="sub-row">
                                <span className="key">Referidos</span>
                                <span className="value">15</span>
                            </div>
                        </div>
                        {/* <div className="row medal">
                            <img src="https://pngimage.net/wp-content/uploads/2018/06/medalla-bronce-png-6.png" alt="" />
                        </div> */}
                    </div>
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
                            <span className="label">Wallet Etehreum</span>

                            <input
                                value={state.walletETH}
                                onChange={e => dispatch({ type: "walletETH", payload: e.target.value })}
                                type="text"
                                className="text-input"
                                disabled={!state.editWallets} />
                        </div>

                        <div className="row">
                            <span className="label">
                                Usuario Coinbase <b>(Recomendado)</b>
                            </span>

                            <input
                                value={state.userCoinbase}
                                onChange={e => dispatch({ type: "userCoinbase", payload: e.target.value })}
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
                                    <button className="button secondary">Actualizar</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Profile