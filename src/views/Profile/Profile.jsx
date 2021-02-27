import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import defaultPhoto from '../../static/images/profile/placeholder-profile.jpg'

import KycPersonView from '../../components/KycPersonView/KycPersonView'
import KycEnterpriseView from '../../components/KycEnterpriseView/KycEnterpriseView'

import './Profile.scss'

// Redux Storage
import reduxStorage from '../../store/store'

//Import components
import ModalTerms from '../../components/ModalTerms/ModalTerms'
import KycUserForm from '../../components/KycUserForm/KycUserForm'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import WalletCard from '../../components/WalletCard/WalletCard'
import ModalChangeWallet from '../../components/ModalChangeWallet/ModalChangeWallet'

import { Petition, readFile } from '../../utils/constanst'
import { useSesionStorage } from '../../utils/hooks/useSesionStorage'

const Profile = () => {
    const { globalStorage: profileData } = reduxStorage.getState()
    const WALLET_TAB = 1
    const INFORMATION_TAB = 2

    const BITCOIN = 'bitcoin'
    const ETHEREUM = 'ethereum'

    const [tab, setTab] = useState(WALLET_TAB)

    // Estado que representa si hay un loader
    const [loader, setLoader] = useState(false)

    // Estado muestra u oculta el modal para cambiar de wallet
    const [changeWallet, setChangeWallet] = useState({
        type: '',
        visible: false,
    })

    // Estado muestra u oculta el modal de terminos y condiciones
    const [showModalTerms, setShowModalTerms] = useState(true)

    const [walletBtc, setWalletBtc] = useState('')
    const [walletEth, setWalletEth] = useState('')
    const [info, setInfo] = useState(null)
    const [modalAddBeneficiary, setModalAddBeneficiary] = useState(false)

    // Estado que almacena la url de la foto de perfil del usuario
    const [profilePhoto, setProfilePhoto] = useSesionStorage(
        `profile-photo-${profileData.id_user}`,
        defaultPhoto
    )

    /**
     * Función que realiza las validaciones para mostrar el tab correspondiente(wallets/ Informacion)
     * @param {Number} tabIndex - Número del tab a verificar
     */

    const checkActiveTab = tabIndex => {
        switch (tabIndex) {
            // Verificaciones para la pagina de LISTA DE USUARIOS
            case WALLET_TAB:
                return tab === WALLET_TAB

            // Verificaciones para la pagina de KYC PERSON
            case INFORMATION_TAB:
                return tab === INFORMATION_TAB

            default:
                return false
        }
    }

    /**Configuracion inicial del componente */
    const initialConfig = async () => {
        try {
            setLoader(true)

            const { data } = await Petition.get(
                `/profile/info?id=${profileData.id_user}`
            ).catch(_ => {
                throw String('No se ha podido obtener tu perfil')
            })

            if (data.error) {
                throw String(data.message)
            } else {
                //Comprobar si la foto se ecuentra en el sesionstorage
                //Cargar la foto de perfil si esta disponible
                if (data.avatar) {
                    if (profilePhoto === defaultPhoto) {
                        readFile(data.avatar).then(photo => {
                            setProfilePhoto(URL.createObjectURL(photo))
                        })
                    }
                } else {
                    setProfilePhoto(defaultPhoto)
                }

                setInfo(data)

                //Cargar wallets
                setWalletBtc(data?.wallet_btc || 'Sin wallet')
                setWalletEth(data?.wallet_eth || 'Sin wallet')
            }
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error, 'error')
        } finally {
            setLoader(false)
        }
    }

    /**Metodo que se ejecuta para actualizar las wallet*/
    const onChangeWallet = async (password, type, newWallet) => {
        try {
            setLoader(true)

            // id_user, btc, eth, username, password, email
            const dataSend = {
                id_user: profileData.id_user,
                email: profileData.email,
                btc: type === BITCOIN ? newWallet : walletBtc,
                eth: type === ETHEREUM ? newWallet : walletEth,
                password: password,
            }

            await Petition.post('/profile/update-wallet', dataSend).then(
                async ({ data }) => {
                    if (data.error) {
                        throw String(data.message)
                    } else {
                        //Actualizamos wallet en la interfaz
                        type === BITCOIN && setWalletBtc(newWallet)
                        type === ETHEREUM && setWalletEth(newWallet)

                        // Cerramos la ventana de confirmacion
                        setChangeWallet({ type: '', visible: false })

                        Swal.fire(
                            'Speed Tradings',
                            'Tus datos se han actualizado',
                            'success'
                        )
                    }
                }
            )
        } catch (error) {
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        initialConfig()
    }, [])

    return (
        <>
            {!showModalTerms && !modalAddBeneficiary && <NavigationBar />}

            <section className='profile'>
                <Link to='/'>
                    <CloseIcon className='profile__close' fill='#ffffff' />
                </Link>

                {loader && (
                    <div className='center__element'>
                        <ActivityIndicator size={100} />
                    </div>
                )}

                <div className='profile__info'>
                    <img
                        src={profilePhoto}
                        alt='Avatar'
                        className='profile__image'
                    />
                    <h2 className='profile__name'>{`${profileData.firstname} ${profileData.lastname}`}</h2>
                    <span className='profile__username'>
                        @{profileData.username}
                    </span>
                    {profileData.kyc_type !== null && (
                        <span className='profile__verified'>
                            {profileData.kyc_type === 1 && 'Cuenta  verificada'}
                            {profileData.kyc_type === 2 &&
                                'Cuenta empresarial verificada'}
                        </span>
                    )}

                    {info && (
                        <div className='two__columns mt-16'>
                            <div className='label__group'>
                                <span className='label white'>Rango</span>
                                <span className='value gray'>
                                    {info.sponsors >= 0 &&
                                        info.sponsors <= 14 &&
                                        'Silver'}

                                    {info.sponsors >= 15 &&
                                        info.sponsors <= 29 &&
                                        'Golden'}

                                    {info.sponsors >= 30 &&
                                        info.sponsors <= 49 &&
                                        'Platinum'}

                                    {info.sponsors >= 50 &&
                                        info.sponsors <= 99 &&
                                        'Diamond'}

                                    {info.sponsors >= 100 && 'VIP'}
                                </span>
                            </div>
                            <div className='label__group'>
                                <span className='label white'>Referidos</span>
                                <span className='value gray'>
                                    {info.sponsors}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className='tabs'>
                    <div
                        onClick={() => setTab(WALLET_TAB)}
                        className={`${
                            tab === WALLET_TAB
                                ? 'tab__item active'
                                : 'tab__item'
                        }`}
                    >
                        <span>Wallets</span>
                    </div>
                    <div
                        onClick={() => setTab(INFORMATION_TAB)}
                        className={`${
                            tab === INFORMATION_TAB
                                ? 'tab__item active'
                                : 'tab__item'
                        }`}
                    >
                        <span>Información</span>
                    </div>
                </div>
                {checkActiveTab(WALLET_TAB) && (
                    <section className='wallets__container'>
                        <WalletCard
                            plan={BITCOIN}
                            wallet={walletBtc}
                            changeWallet={() =>
                                setChangeWallet({
                                    type: BITCOIN,
                                    visible: true,
                                })
                            }
                        />
                        <WalletCard
                            plan='ethereum'
                            wallet={walletEth}
                            changeWallet={() =>
                                setChangeWallet({
                                    type: ETHEREUM,
                                    visible: true,
                                })
                            }
                        />
                    </section>
                )}
                {checkActiveTab(INFORMATION_TAB) &&
                    (profileData.kyc_type === 1 ? (
                        <KycPersonView
                            idUser={profileData.id_user}
                            modalAddBeneficiary={modalAddBeneficiary}
                            setModalAddBeneficiary={setModalAddBeneficiary}
                        />
                    ) : (
                        <KycEnterpriseView idUser={profileData.id_user} />
                    ))}

                {changeWallet.visible && (
                    <ModalChangeWallet
                        closeModal={() => setChangeWallet(false)}
                        type={changeWallet.type}
                        onChangeWallet={onChangeWallet}
                    />
                )}

                <a
                    href=''
                    className='text__terms-and-conditions'
                    onClick={e => {
                        e.preventDefault()
                        setShowModalTerms(true)
                    }}
                >
                    Términos y condiciones
                </a>

                {showModalTerms && (
                    <ModalTerms closeModal={() => setShowModalTerms(false)} />
                )}
            </section>
        </>
    )
}

export default Profile
