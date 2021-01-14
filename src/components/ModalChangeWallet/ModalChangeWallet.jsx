import React, { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import PasswordField from '../PasswordField/PasswordField'
import Swal from 'sweetalert2'
import './ModalChangeWallet.scss'

const ModalChangeWallet = ({ closeModal, type, onChangeWallet }) => {
  const [password, setPassword] = useState('')
  const [wallet, setWallet] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (password.length < 4)
      return Swal.fire({
        icon: 'error',
        title: 'Contraseña invalida',
        text: 'Ingrese una contraseña valida',
      })

    if (wallet.length < 4)
      return Swal.fire({
        icon: 'error',
        title: 'Wallet invalida',
        text: 'Ingrese una wallet valida',
      })

    //Actualizar el wallet en la BD y en la interfaz
    onChangeWallet(password, type, wallet)

    //Cerrar modal
    closeModal()
  }

  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal__change-wallet">
          <div className="two__columns">
            <h2 className="modal__title">Cambiar wallet - {type}</h2>

            <CloseIcon
              className="close__icon"
              fill="#ffffff"
              onClick={closeModal}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal__group ">
              <span className="label white">Ingrese su contraseña</span>
              <PasswordField
                className="value"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="modal__group">
              <label className="label white" htmlFor="wallet">
                Ingrese la nueva wallet
              </label>
              <input
                type="text"
                className="text-input"
                id="wallet"
                value={wallet}
                onChange={e => setWallet(e.target.value)}
              />
            </div>

            <button type="submit" className="button green full-width">
              Cambiar Wallet
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ModalChangeWallet
