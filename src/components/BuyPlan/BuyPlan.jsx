import React, { useEffect, useReducer } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Import Assets
import "./BuyPlan.scss"
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"

// Import info or components
import { Petition, wallets, copyData } from "../../utils/constanst"

const initialState = {
    // Estado que guardara los planes
    plans: [],

    // Estado que guarda el hash de transaccion
    hash: "",

    // Estado que guarda el valor de select (Plan de inversion / monto de inversion)
    amount: 0,

    // Estado que indica si hay un proceso
    loader: false,
}

const reducer = (state, action) => {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const BuyPlan = ({ idCrypto = 1, onBuy = () => { } }) => {
    // Redux store
    const storage = useSelector(({ globalStorage }) => globalStorage)

    const [state, dispatch] = useReducer(reducer, initialState)

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
                        dispatch({ type: "plans", payload: data })
                    }
                })
        } catch (error) {

        }
    }, [])

    /**Metodo que se ejecuta cuando el usuario compra el plan */
    const Buy = async () => {
        dispatch({ type: "loader", payload: true })

        try {
            // Validamos el hash
            if (state.hash.length < 8) {
                throw 'Hash invalido'
            }

            // Validamos que el monto sea correcto
            if (state.amount === 0) {
                throw "Seleccion un Plan de inversion"
            }

            // Armamos los datos a enviar al backend
            const data = {
                id_currency: idCrypto,
                id_user: storage.id_user,
                hash: state.hash,
                amount: parseFloat(state.amount),
            }

            await Petition.post('/buy/plan', data, {
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
            })

        } catch (error) {
            Swal.fire("Ha ocurrido un error", error.toString(), "warning")
        }


        dispatch({ type: "loader", payload: false })
    }

    /**Metodo que se ejecuta cuando el usuario selecciona el monto de inversion */
    const onChangeAmount = (e) => {
        const { value } = e.target

        dispatch({ type: "amount", payload: parseFloat(value) })
    }

    return (
        <div className="container-buy-plan">

            {
                idCrypto === 1 &&
                <>
                    <img src={LogoBTC} className="logo-crypto" alt="bitcoin" />
                    <h2>Adquirir plan de Bitcoin</h2>
                </>
            }

            {
                idCrypto === 2 &&
                <>
                    <img src={LogoETH} className="logo-crypto" alt="ethereum" />
                    <h2>Adquirir plan de Ethereum</h2>
                </>
            }

            <div className="row wallets">
                <span>Toca para copiar wallet</span>

                {
                    idCrypto === 1 &&
                    <span className="wallet" onClick={_ => copyData(wallets.btc)}>{wallets.btc}</span>
                }

                {
                    idCrypto === 2 &&
                    <span className="wallet" onClick={_ => copyData(wallets.eth)}>{wallets.eth}</span>
                }
            </div>

            <div className="row">
                <span>Selecciona tu plan</span>
                <select className="picker" value={state.amount} onChange={onChangeAmount}>
                    <option value={0} disabled>Selecciona un plan</option>
                    {
                        state.plans.map((item, key) =>
                            <option key={key} value={item.amount}>
                                {
                                    idCrypto === 1 &&
                                    item.amount + ' BTC'
                                }

                                {
                                    idCrypto === 2 && 
                                    item.amount + ' ETH'
                                }
                            </option>
                        )
                    }
                </select>
            </div>

            <div className="row">
                <span>Escribe el hash de transaccion</span>
                <input
                    value={state.hash}
                    onChange={e => dispatch({ type: "hash", payload: e.target.value })}
                    type="text"
                    className="text-input"
                    placeholder="ejem.. as4d6as4d65a4sd8" />
            </div>

            <button disabled={state.loader} className="button secondary large" onClick={Buy}>
                Comprar
            </button>
        </div>
    )
}

export default BuyPlan