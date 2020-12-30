import React, { useEffect, useState } from 'react'
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-big.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum-big.svg'
import moment from 'moment'

//Importar estilos
import './styles.scss'

const DashboardDetails = ({ plan, data = {} }) => {
  const PLAN = {
    BITCOIN: 'bitcoin',
  }

  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (data) {
      const result = (data.amount / data.amount_to_win) * 100
      setPercentage(result)
    }
  }, [data])

  return (
    <article className="card__plan">
      {plan === 'bitcoin' ? (
        <BitcoinIcon className="plan__icon icon" color="#ffcb08" />
      ) : (
        <EthereumIcon className="plan__icon icon" color="#9ed3da" />
      )}

      <div className="bar__container">
        <p className="value">{`Ganado (${percentage}%)`}</p>
        <div className={`${plan === PLAN.BITCOIN ? 'bar yellow' : 'bar'}`}>
          <div
            style={{ width: `${percentage}%` }}
            className={`${
              plan === PLAN.BITCOIN
                ? 'bar__progressive yellow'
                : 'bar__progressive'
            }`}
          ></div>
        </div>
      </div>

      <div className="text__group">
        <span className={`${plan === PLAN.BITCOIN ? 'label yellow' : 'label'}`}>
          Ultimo reporte de ganancia
        </span>
        <p className="value text__bigger">
          {data?.last_pay}
          {plan === PLAN.BITCOIN ? ' BTC' : ' ETC'}
        </p>
      </div>

      <button
        className={`${
          plan === PLAN.BITCOIN
            ? 'button upgrade__button yellow'
            : 'button upgrade__button '
        }`}
      >
        UPGRADE
      </button>

      <div className="auto-columns">
        <div className="text__group">
          <span
            className={`${plan === PLAN.BITCOIN ? 'label yellow' : 'label'}`}
          >
            Saldo pendiente
          </span>
          <p className="value">{data?.amount_rest}</p>
        </div>
        <div className="text__group">
          <span
            className={`${plan === PLAN.BITCOIN ? 'label yellow' : 'label'}`}
          >
            Fecha de inicio
          </span>
          <p className="value">
            {moment(data?.start_date).format('DD-MM-YYYY')}
          </p>
        </div>
      </div>
    </article>
  )
}

export default DashboardDetails
