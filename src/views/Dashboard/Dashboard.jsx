import React, { useState, useEffect } from 'react'

import Swal from 'sweetalert2'
import { Petition } from '../../utils/constanst'
import { useSelector } from 'react-redux'
import moment from 'moment'

//Import icons
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-small.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum -small.svg'

//Importar estilos
import './Dashboard.scss'

//Import components
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import BuyPlan from '../../components/BuyPlan'
import DashboardDetails from '../../components/DashboardDetails/DashboardDetails'
import EmptyPlan from '../../components/EmptyPlan/EmptyPlan'
import LineChart from '../../components/LineChart/LineChart'
import ListOfProfits from '../../components/ListOfProfits/ListOfProfits'
import ModalUpgrade from '../../components/ModalUpgrade/ModalUpgrade'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ModalDatePicker from '../../components/ModalDatePicker/ModalDatePicker'

import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa'

const BITCOIN = { id: 1, name: 'bitcoin' }
const ETHEREUM = { id: 2, name: 'ethereum' }

const Dashboard = () => {
    const storage = useSelector(({ globalStorage }) => globalStorage)
    //const { navigation, globalStorage } = storeRedux.getState()
    // Estado para mostrar u ocultar el loader
    const [loader, setLoader] = useState(true)

    // Estado para cambiar los datos que se muestran en la tabla de ganancias
    const [currencySelected, setCurrencySelected] = useState('')

    // Estado que alamacena los datos para los planes BTC y ETH del usuario
    const [dataDashoardBTC, setDataDashboardBTC] = useState({
        info: null,
        history: null,
    })
    const [dataDashoardETH, setDataDashboardETH] = useState({
        info: null,
        history: null,
    })

    //Estado para mostrar/ocultar modal de comprar plan
    const [modalBuyPlan, setModalBuyPlan] = useState({
        visible: false,
        idCrypto: 0,
    })

    //Estado para mostrar/ocultar modal de upgrade plan
    const [modalUpgrade, setModalUpgrade] = useState({
        visible: false,
        type: '',
    })

    //Estado para mostrar/ocultar modal de fechas
    const [modalDate, setModalDate] = useState(false)

    const [greeting, setGreeting] = useState('')

    const [dateRange, setDateRange] = useState({
        start: '',
        end: '',
    })

    const ConfigurateComponent = async () => {
        try {
            // constant header petition
            const headers = {
                headers: {
                    'x-auth-token': storage.token,
                },
            }

            // Get data BTC
            const { data: dataBTC } = await Petition.get(
                '/dashboard/1',
                headers
            )

            // verificamos si hay un error al cargar los datos
            if (dataBTC.error) {
                throw String(dataBTC.message)
            } else if (Object.keys(dataBTC).length > 0) {
                setDataDashboardBTC(dataBTC)

                //Preseleccionar por defecto BTC en caso de que este disponible
                setCurrencySelected(BITCOIN.name)
            }

            // Get data ETH
            const { data: dataETH } = await Petition.get(
                '/dashboard/2',
                headers
            )

            // verificamos si hay un error al cargar los datos
            if (dataETH.error) {
                throw String(dataETH.message)
            } else if (Object.keys(dataETH).length > 0) {
                setDataDashboardETH(dataETH)
                //Preseleccionar por defecto ETH en caso de que este disponible
                setCurrencySelected(ETHEREUM.name)
            }

            setLoader(false)
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    //Obtener la lista de ganancias
    const getProfitList = async rangeDate => {
        try {
            // constant header petition
            const headers = {
                headers: {
                    'x-auth-token': storage.token,
                },
            }

            if (dataDashoardBTC.info) {
                // Obtener ganacias en bitcoin
                const { data: profitsBTC } = await Petition.get(
                    `/dashboard/all-reports/${BITCOIN.id}?date_from=${rangeDate.startDate}&date_to=${rangeDate.endDate}`,
                    headers
                )

                // verificamos si hay un error al cargar los datos
                if (profitsBTC.error) {
                    throw String(profitsBTC.message)
                } else if (Object.keys(profitsBTC).length > 0) {
                    //Actualizamos las ganancias en la tabla de bitcoin
                    setDataDashboardBTC({
                        ...dataDashoardBTC,
                        history: profitsBTC.history,
                        price: profitsBTC.price,
                    })
                }
            }

            if (dataDashoardETH.info) {
                // Get data ETH
                const { data: profitsETH } = await Petition.get(
                    `/dashboard/all-reports/${ETHEREUM.id}?date_from=${rangeDate.startDate}&date_to=${rangeDate.endDate}`,
                    headers
                )

                // verificamos si hay un error al cargar los datos
                if (profitsETH.error) {
                    throw String(profitsETH.message)
                } else if (Object.keys(profitsETH).length > 0) {
                    //Actualizamos las ganancias en la tabla de ethereum
                    setDataDashboardETH({
                        ...dataDashoardETH,
                        history: profitsETH.history,
                        price: profitsETH.price,
                    })
                }
            }
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    const onSelectRangeDate = rangeDate => {
        //Mostrar etiqueta con el rango de fecha seleccionado
        setDateRange({
            start: moment(rangeDate.startDate).format('DD MMM YYYY'),
            end: moment(rangeDate.endDate).format('DD MMM YYYY'),
        })
        //Obtener las ganacias por rango de fechas
        getProfitList(rangeDate)
    }

    useEffect(() => {
        ConfigurateComponent()
        // Obtener saludo
        const hour = moment().format('HH')
        const stateDay =
            hour > 0 && hour <= 12
                ? 'Buenos dias'
                : hour >= 13 && hour <= 18
                ? 'Buenas tardes'
                : 'Buenas noches'

        setGreeting(stateDay + `, ${storage.firstname}`)
    }, [])

    //Deshabilitar el scroll cuando se ve el modal de fecha
    useEffect(() => {
        if (modalDate) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'visible'
        }
    }, [modalDate])

    return (
        <>
            {/*Mostrar el navbar solo cuando los modales esten ocultos*/}
            {!modalBuyPlan.visible && !modalUpgrade.visible && !modalDate && (
                <NavigationBar />
            )}
            <section className="Dashboard">
                {loader && (
                    <div className="center__element">
                        <ActivityIndicator
                            size={128}
                            className="loader-dashboard"
                        />
                    </div>
                )}
                <div className="greeting">
                    <p className="label white">{greeting}</p>
                </div>
                <main className="plan__container">
                    {dataDashoardBTC.info && !loader ? (
                        <DashboardDetails
                            plan={BITCOIN.name}
                            data={dataDashoardBTC.info}
                            upgradePlan={() =>
                                setModalUpgrade({ visible: true, type: 'btc' })
                            }
                        />
                    ) : (
                        <EmptyPlan
                            plan={BITCOIN.name}
                            onClick={() =>
                                setModalBuyPlan({
                                    visible: true,
                                    idCrypto: BITCOIN.id,
                                })
                            }
                        />
                    )}

                    {dataDashoardETH.info && !loader ? (
                        <DashboardDetails
                            plan={ETHEREUM.name}
                            data={dataDashoardETH.info}
                            upgradePlan={() =>
                                setModalUpgrade({ visible: true, type: 'eth' })
                            }
                        />
                    ) : (
                        <EmptyPlan
                            plan={ETHEREUM.name}
                            onClick={() =>
                                setModalBuyPlan({
                                    visible: true,
                                    idCrypto: ETHEREUM.id,
                                })
                            }
                        />
                    )}
                </main>

                <LineChart
                    dataDashoardBTC={dataDashoardBTC}
                    dataDashoardETH={dataDashoardETH}
                />

                <section className="profits__container">
                    <div className="profits__filter--container">
                        <div>
                            <h2>Historial</h2>
                            {dateRange.start && dateRange.end && (
                                <span className="caption">
                                    {`Ganancias del ${dateRange.start} al ${dateRange.end}`}
                                </span>
                            )}
                        </div>

                        <div className="profits__filter--buttons">
                            <button
                                className="button btn-date"
                                onClick={() => setModalDate(true)}
                            >
                                <CalendarIcon size={22} />
                            </button>

                            {/*Mostrar el switcher de cambiar de moneda solo cuando BTC y ETH esten disponibles ambos*/}
                            {dataDashoardBTC.history &&
                                dataDashoardETH.history && (
                                    <div className="switcher">
                                        <div
                                            className={`${
                                                currencySelected ===
                                                BITCOIN.name
                                                    ? 'icon__button active'
                                                    : 'icon__button'
                                            }`}
                                            onClick={() =>
                                                setCurrencySelected(
                                                    BITCOIN.name
                                                )
                                            }
                                        >
                                            <BitcoinIcon
                                                className="switch__icon icon"
                                                color="#ffcb08"
                                            />
                                        </div>
                                        <div
                                            className={`${
                                                currencySelected ===
                                                ETHEREUM.name
                                                    ? 'icon__button active'
                                                    : 'icon__button'
                                            }`}
                                            onClick={() =>
                                                setCurrencySelected(
                                                    ETHEREUM.name
                                                )
                                            }
                                        >
                                            <EthereumIcon
                                                className="switch__icon icon"
                                                color="#9ed3da"
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    <ListOfProfits
                        currencySelected={currencySelected}
                        dataDashoardBTC={dataDashoardBTC}
                        dataDashoardETH={dataDashoardETH}
                    />
                </section>
            </section>

            {modalUpgrade.visible &&
                (modalUpgrade.type === 'btc'
                    ? dataDashoardBTC.info && (
                          <ModalUpgrade
                              closeModal={() =>
                                  setModalUpgrade({
                                      ...modalUpgrade,
                                      visible: false,
                                  })
                              }
                              type="btc"
                              disabled={dataDashoardBTC.info.approved === 0}
                              idInvestment={dataDashoardBTC.info.id_investment}
                              amount={dataDashoardBTC.info.amount}
                              amountToday={dataDashoardBTC.info.total_paid}
                          />
                      )
                    : dataDashoardETH.info && (
                          <ModalUpgrade
                              closeModal={() =>
                                  setModalUpgrade({
                                      ...modalUpgrade,
                                      visible: false,
                                  })
                              }
                              type="eth"
                              disabled={dataDashoardETH.info.approved === 0}
                              idInvestment={dataDashoardETH.info.id_investment}
                              amount={dataDashoardETH.info.amount}
                              amountToday={dataDashoardETH.info.total_paid}
                          />
                      ))}

            {modalBuyPlan.visible && (
                <BuyPlan
                    onBuy={ConfigurateComponent}
                    closeModal={() =>
                        setModalBuyPlan({ ...modalBuyPlan, visible: false })
                    }
                    idCrypto={modalBuyPlan.idCrypto}
                />
            )}

            {modalDate && (
                <ModalDatePicker
                    currency={currencySelected}
                    closeModal={() => setModalDate(false)}
                    onSelect={_data => onSelectRangeDate(_data)}
                />
            )}
        </>
    )
}

export default Dashboard
