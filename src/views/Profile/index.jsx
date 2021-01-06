import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import defaultPhoto from '../../static/images/profile/placeholder-profile.jpg'

import KycPersonView from '../../components/KycPersonView/KycPersonView'
import './styles.scss'

// Redux Storage
import reduxStorage from '../../store/store'

// Import service
import { kycUserBeneficiaryData } from '../../services/kycUser.service'

//Import components
import ModalTerms from '../../components/ModalTerms/ModalTerms'
import KycUserForm from '../../components/KycUserForm/KycUserForm'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import WalletCard from '../../components/WalletCard/WalletCard'
import ModalChangeWallet from '../../components/ModalChangeWallet/ModalChangeWallet'

import { Petition, readFile } from '../../utils/constanst'

const Profile = () => {
  const WALLET_TAB = 1
  const INFORMATION_TAB = 2

  const [tab, setTab] = useState(WALLET_TAB)
  const [showTerms, setShowTerms] = useState(false)
  // Estado que representa si hay un loader
  const [loader, setLoader] = useState(false)
  // Estado que representa si hay un loader
  const [changeWallet, setChangeWallet] = useState({
    type: '',
    visible: false,
  })

  const [walletBtc, setWalletBtc] = useState('')
  const [walletEth, setWalletEth] = useState('')

  const [info, setInfo] = useState(null)

  const { globalStorage: profileData } = reduxStorage.getState()

  /**
   * Función que realiza las validaciones para mostrar el tab correspondiente(wallets/ KYC / beneficiario)
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
        //Cargar la foto de perfil si esta disponible
        if (data.avatar) {
          readFile(data.avatar).then(photo => {
            setInfo({
              ...data,
              avatarImage: URL.createObjectURL(photo),
            })
          })
        } else {
          //Cargar foto predeterminada si el usuario no tiene avatar
          setInfo({
            ...data,
            avatarImage: defaultPhoto,
          })
        }
        //Cargar wallets
        setWalletBtc(profileData.wallet_btc)
        setWalletEth(profileData.wallet_eth)
      }
    } catch (error) {
      Swal.fire('Ha ocurrido un error', error, 'error')
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    initialConfig()
  }, [])

  return (
    <>
      <NavigationBar />
      <section className="profile">
        <Link to="/">
          <CloseIcon className="profile__close" fill="#ffffff" />
        </Link>

        {loader && (
          <div className="center__element">
            <ActivityIndicator size={100} />
          </div>
        )}

        <div className="profile__info">
          <img
            src={info?.avatarImage}
            alt="Avatar"
            className="profile__image"
          />
          <h2 className="profile__name">{`${profileData.firstname} ${profileData.lastname}`}</h2>
          <span className="profile__username">@{profileData.username}</span>
          {profileData.kyc_type !== null && (
            <span className="profile__verified">
              {profileData.kyc_type === 1 && 'Cuenta  verificada'}
              {profileData.kyc_type === 2 && 'Cuenta empresarial verificada'}
            </span>
          )}

          {info && (
            <div className="two__columns mt-16">
              <div className="label__group">
                <span className="label white">Rango</span>
                <span className="value gray">
                  {info.sponsors >= 0 && info.sponsors <= 14 && 'Silver'}

                  {info.sponsors >= 15 && info.sponsors <= 29 && 'Golden'}

                  {info.sponsors >= 30 && info.sponsors <= 49 && 'Platinum'}

                  {info.sponsors >= 50 && info.sponsors <= 99 && 'Diamond'}

                  {info.sponsors >= 100 && 'VIP'}
                </span>
              </div>
              <div className="label__group">
                <span className="label white">Referidos</span>
                <span className="value gray">{info.sponsors}</span>
              </div>
            </div>
          )}
        </div>
        <div className="tabs">
          <div
            onClick={() => setTab(WALLET_TAB)}
            className={`${
              tab === WALLET_TAB ? 'tab__item active' : 'tab__item'
            }`}
          >
            <span>Wallets</span>
          </div>
          <div
            onClick={() => setTab(INFORMATION_TAB)}
            className={`${
              tab === INFORMATION_TAB ? 'tab__item active' : 'tab__item'
            }`}
          >
            <span>Información</span>
          </div>
        </div>
        {checkActiveTab(WALLET_TAB) && (
          <section className="wallets__container">
            <WalletCard
              plan="bitcoin"
              wallet={walletBtc}
              changeWallet={() =>
                setChangeWallet({ type: 'bitcoin', visible: true })
              }
            />
            <WalletCard
              plan="ethereum"
              wallet={walletEth}
              changeWallet={() =>
                setChangeWallet({ type: 'ethereum', visible: true })
              }
            />
          </section>
        )}
        {checkActiveTab(INFORMATION_TAB) && <KycPersonView />}

        {changeWallet.visible && (
          <ModalChangeWallet
            closeModal={() => setChangeWallet(false)}
            type={changeWallet.type}
            onSuccess={newWallet =>
              changeWallet.type === 'bitcoin'
                ? setWalletBtc(newWallet)
                : setWalletEth(newWallet)
            }
          />
        )}
      </section>
    </>
  )
}

export default Profile
