import React from 'react'
import { ReactComponent as EditIcon } from '../../static/icons/edit.svg'

import './WalletCard.scss'

const WalletCard = ({
  plan = 'bitcoin',
  wallet = 'sin wallet',
  changeWallet,
}) => {
  return (
    <article className="wallet__card">
      <div className="two__columns">
        <span className="wallet__title">Wallet {plan}</span>

        <EditIcon className="edit__icon" onClick={changeWallet} />
      </div>
      <p className="wallet__value">{wallet}</p>
    </article>
  )
}

export default WalletCard
