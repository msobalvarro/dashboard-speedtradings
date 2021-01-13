import React, { useState, useEffect, useReducer } from 'react'

// Redux Storage
import reduxStorage from '../../store/store'

// Import Components
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import Modal from '../../components/Modal/Modal'
import KycUserForm from '../../components/KycUserForm/KycUserForm'
import ModalTerms from '../../components/ModalTerms/ModalTerms'

// Import service
import { kycUserBeneficiaryData } from '../../services/kycUser.service'

// Import Assets
import './Profile.scss'
import ImagePlaceholder from '../../static/images/profile/placeholder-profile.jpg'
import { ReactComponent as VerifyBadgetIcon } from '../../static/icons/check-circular-button.svg'
import Countries from '../../utils/countries.json'

import { Petition, setStorage, readFile, calcAge } from '../../utils/constanst'
import Swal from 'sweetalert2'
import { SETSTORAGE } from '../../store/ActionTypes'
import moment from 'moment'
import { userValidations } from '../../utils/kycFormValidations'

/**Estado incial de storage de REACT */
const initialState = {
  // Estado que indica si las wallets y user coinbase es editable
  editWallets: false,

  // Estado que almacena la direccion wallet
  walletBTC: '',
  walletETH: '',

  // Initial state BTC/ETH/Username Coinbase
  intialBTC: '',
  intialETH: '',

  // Password confirm
  password: '',

  // Typo de kyc
  kycType: null,
}

/**Funcion que ejecuta el storage de REACT */
const reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
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

  const [beneficiary, setBeneficiary] = useState({})
  const [backupBeneficiary, setBackupBeneficiary] = useState({})

  const [isReadOnly, setIsReadOnly] = useState(true)

  const [userAge, setUserAge] = useState(0)

  const [createBeneficiary, setCreateBeneficiary] = useState(false)

  const [existBeneficiary, setExistBeneficiary] = useState(true)

  const [showTerms, setShowTerms] = useState(false)

  /**Metodo que se ejecuta cuando cancela la edicion de wallet y usuario coinbase */
  const cancelEditWallet = () => {
    dispatch({ type: 'editWallets', payload: false })

    // Reseteamos todos los datos por defecto
    dispatch({ type: 'walletBTC', payload: state.intialBTC })
    dispatch({ type: 'walletETH', payload: state.intialETH })
  }

  /**Metodo que se ejecuta cuando las wallets y user coinbase sean editables */
  const onEditinWallet = () => {
    dispatch({ type: 'editWallets', payload: true })
  }

  /**Meotodo que se ejecuta para actualizar los datos despues de escribir password */
  const onChangeWallet = async () => {
    try {
      setLoader(true)

      if (state.password.length === '') {
        throw String('Escribe tu Contraseña para continuar')
      }

      // id_user, btc, eth, username, password, email
      const dataSend = {
        id_user: globalStorage.id_user,
        email: globalStorage.email,
        btc: state.walletBTC,
        eth: state.walletETH,
        password: state.password,
      }

      await Petition.post('/profile/update-wallet', dataSend).then(
        async ({ data }) => {
          if (data.error) {
            throw String(data.message)
          } else {
            // Hacemos el dispatch al store de redux
            reduxStorage.dispatch({ type: SETSTORAGE, payload: data })

            // Actualizamos el localstorage
            setStorage(data)

            // Limpiamos el campo password
            dispatch({ type: 'password', payload: '' })

            // Reconfiguramos los datos de redux
            await initialConfig()

            // Reseteamos todo el formulario
            dispatch({ type: 'editWallets', payload: false })

            // Cerramos la ventana de confirmacion
            setShowConfirm(false)

            Swal.fire(
              'Speed Tradings',
              'Tus datos se han actualizado',
              'success'
            )
          }
        }
      )

      dispatch({ type: 'password', payload: '' })
    } catch (error) {
      Swal.fire('Ha ocurrido un error', error.toString(), 'error')
    } finally {
      setLoader(false)
    }
  }

  /**Metodo que se ejecuta cuando el usuario hace clic atras en confirmacion de password */
  const onCancellEditWallet = () => {
    setShowConfirm(false)
  }

  /**Configuracion inicial del componente */
  const initialConfig = async () => {
    try {
      setLoader(true)
      const { globalStorage: updateStorage } = reduxStorage.getState()

      // Initial wallet BTC
      dispatch({ type: 'walletBTC', payload: updateStorage.wallet_btc })
      dispatch({ type: 'intialBTC', payload: updateStorage.wallet_btc })

      // Initial wallet ETH
      dispatch({ type: 'walletETH', payload: updateStorage.wallet_eth })
      dispatch({ type: 'intialETH', payload: updateStorage.wallet_eth })

      // Initial kyc type
      dispatch({ type: 'kycType', payload: updateStorage.kyc_type })

      const { data } = await Petition.get(
        `/profile/info?id=${globalStorage.id_user}`
      ).catch(_ => {
        throw String('No se ha podido actualizar tu perfil')
      })

      if (data.error) {
        throw String(data.message)
      } else {
        setInfo(data)
      }

      const { data: dataBeneficiary } = await Petition.get(
        '/kyc/user/beneficiary'
      )

      if (Object.keys(dataBeneficiary).length > 0) {
        const { profilePictureId, indentificationPictureId } = dataBeneficiary

        // Se obtienen las fotos desde el servidor
        dataBeneficiary.profilePicture = await readFile(profilePictureId)
        dataBeneficiary.IDPicture = await readFile(indentificationPictureId)

        const { nationality, residence } = dataBeneficiary

        setExistBeneficiary(true)
        setUserAge(calcAge(dataBeneficiary.userBirthday))
        setBeneficiary({
          ...dataBeneficiary,
          nationality: Countries.findIndex(
            item => item.phoneCode === nationality
          ),
          residence: Countries.findIndex(item => item.phoneCode === residence),
        })
      } else {
        setUserAge(18)
      }
    } catch (error) {
      Swal.fire('Ha ocurrido un error', error, 'error')
    } finally {
      setLoader(false)
    }
  }

  const submitBeneficiary = async _ => {
    try {
      setLoader(true)

      if (state.password.length === '') {
        throw String('Escribe tu Contraseña para continuar')
      }

      const dataSend = {
        passwordUser: state.password,
        emailUser: globalStorage.email,
        ...(await kycUserBeneficiaryData(
          beneficiary,
          userAge,
          existBeneficiary
        )),
      }
      console.log(dataSend)

      const { data } = await Petition.post('/kyc/user/beneficiary', dataSend)

      if (data.error) {
        throw String(data.message)
      }
      console.log(data)
      setBackupBeneficiary({})
      setIsReadOnly(true)
      setCreateBeneficiary(false)

      Swal.fire('Speed Tradings', 'Tus datos se han actualizado', 'success')
    } catch (error) {
      console.error(error)
      Swal.fire('Speed Tradings', error.toString(), 'error')
    } finally {
      // Cerramos la ventana de confirmacion
      setShowConfirm(false)
      // Reseteamos el campo de la contraseña
      dispatch({ type: 'password', payload: '' })

      setLoader(false)
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
            <div className="row centered">
              <h2 className="full-name">
                {globalStorage.firstname} {globalStorage.lastname}
              </h2>
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

              {info !== null && (
                <div className="item">
                  <div className="ng-row">
                    <span className="key">Primera actividad</span>
                    <span>
                      {moment(info.start_date).format('MMM. D, YYYY')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {info !== null && (
            <div className="col">
              <div className="row right">
                <span className="verified-account">
                  {globalStorage.kyc_type !== null && (
                    <VerifyBadgetIcon className="verifyBadget" />
                  )}
                  {globalStorage.kyc_type === 1 && 'cuenta verificada'}

                  {globalStorage.kyc_type === 2 &&
                    'cuenta empresarial verificada'}
                </span>
              </div>

              <div className="row">
                <div className="sub-row">
                  <span className="key">Rango</span>

                  {info.sponsors >= 0 && info.sponsors <= 14 && (
                    <span className="value">SILVER</span>
                  )}

                  {info.sponsors >= 15 && info.sponsors <= 29 && (
                    <span className="value">GOLDEN</span>
                  )}

                  {info.sponsors >= 30 && info.sponsors <= 49 && (
                    <span className="value">PLATINUM</span>
                  )}

                  {info.sponsors >= 50 && info.sponsors <= 99 && (
                    <span className="value">DIAMOND</span>
                  )}

                  {info.sponsors >= 100 && <span className="value">VIP</span>}
                </div>

                <div className="sub-row">
                  <span className="key">Referidos</span>
                  <span className="value">{info.sponsors}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="main-row resalt">
          <div className="col wallet">
            <div className="row">
              <span className="label">Wallet Bitcoin</span>

              <input
                value={state.walletBTC}
                onChange={e =>
                  dispatch({ type: 'walletBTC', payload: e.target.value })
                }
                type="text"
                className="text-input"
                disabled={!state.editWallets}
              />
            </div>

            <div className="row">
              <span className="label">Wallet Ethereum</span>

              <input
                value={state.walletETH}
                onChange={e =>
                  dispatch({ type: 'walletETH', payload: e.target.value })
                }
                type="text"
                className="text-input"
                disabled={!state.editWallets}
              />
            </div>

            <div className="buttons">
              {!state.editWallets && (
                <button onClick={onEditinWallet} className="button secondary">
                  Editar
                </button>
              )}

              {state.editWallets && (
                <>
                  <button onClick={cancelEditWallet} className="button margin">
                    Cancelar
                  </button>
                  <button
                    className="button secondary"
                    onClick={_ => setShowConfirm(true)}
                  >
                    Actualizar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {Object.keys(beneficiary).length === 0 &&
        !createBeneficiary &&
        globalStorage.kyc_type === 1 && (
          <div className="row add-beneficiary">
            <button
              onClick={_ => {
                setCreateBeneficiary(true)
                setIsReadOnly(false)
              }}
              className="button secondary"
            >
              agregar beneficiario
            </button>
          </div>
        )}

      {(Object.keys(beneficiary).length > 0 || createBeneficiary) && (
        <div className="header-profile beneficiary">
          <div className="main-row">
            <div className="row center">
              <KycUserForm
                isReadOnly={isReadOnly}
                state={beneficiary}
                setState={setBeneficiary}
                secondaryTypeForm={userAge < 18 ? 1 : 2}
              />
            </div>
          </div>

          {userAge >= 18 && (
            <div className="main-row resalt">
              <div className="row buttons-row">
                {isReadOnly && (
                  <button
                    onClick={_ => {
                      setBackupBeneficiary(beneficiary)
                      setIsReadOnly(false)
                      setCreateBeneficiary(true)
                    }}
                    className="button secondary"
                  >
                    editar
                  </button>
                )}

                {!isReadOnly && (
                  <>
                    <button
                      onClick={_ => {
                        setBeneficiary(backupBeneficiary)
                        setBackupBeneficiary({})
                        setIsReadOnly(true)
                        setCreateBeneficiary(false)
                      }}
                      className="button cancel"
                    >
                      cancelar
                    </button>
                    <button
                      disabled={!userValidations.beneficiaryInfo(beneficiary)}
                      onClick={_ => setShowConfirm(true)}
                      className="button secondary"
                    >
                      guardar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!showConfirm && loader && (
        <Modal persist={true} onlyChildren>
          <ActivityIndicator size={64} />
        </Modal>
      )}

      {showConfirm && (
        <div className="modal-password">
          {loader && <ActivityIndicator />}

          {!loader && (
            <>
              <div className="row">
                <span>Escribe tu Contraseña parta continuar</span>

                <input
                  value={state.password}
                  type="password"
                  autoFocus={true}
                  onChange={e =>
                    dispatch({ type: 'password', payload: e.target.value })
                  }
                  className="text-input"
                />
              </div>

              <div className="buttons">
                <button className="button margin" onClick={onCancellEditWallet}>
                  Atras
                </button>
                <button
                  className="button secondary"
                  onClick={
                    createBeneficiary ? submitBeneficiary : onChangeWallet
                  }
                >
                  Procesar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <span className="terms-label" onClick={_ => setShowTerms(true)}>
        Términos y condiciones
      </span>

      <ModalTerms isVisible={showTerms} onClose={_ => setShowTerms(false)} />
    </div>
  )
}

export default Profile
