import React from 'react'
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-big.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum-big.svg'

//Importar estilos
import './EmptyPlan.scss'

const EmptyPlan = ({ plan = 'ethereum', onClick }) => {
  return (
    <section className="EmptyPlan">
      {plan === 'bitcoin' ? (
        <BitcoinIcon className="plan__icon icon" color="#ffcb08" />
      ) : (
        <EthereumIcon className="plan__icon icon" color="#9ed3da" />
      )}
      <div>
        <h3
          className={`${plan === 'bitcoin' ? 'label yellow' : 'label skyblue'}`}
        >
          No cuenta con un plan de activo de {plan}
        </h3>
        <p className="caption">¿Desea adquirir un plan de {plan}?</p>
      </div>
      <button
        onClick={onClick}
        className={`${
          plan === 'bitcoin'
            ? 'button acquire__button yellow'
            : 'button acquire__button skyblue'
        }`}
      >
        Adquirir
      </button>
    </section>
  )
}

export default EmptyPlan
