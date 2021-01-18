import React, { useEffect, useState } from 'react'
import { ReactComponent as BitcoinIcon } from '../../static/icons/bitcoin-big.svg'
import { ReactComponent as EthereumIcon } from '../../static/icons/ethereum-big.svg'
import moment from 'moment'

//Importar estilos
import './DashboardDetails.scss'

/**
 * @param {String} plan - Tipo de moneda a procesar
 * @param {Object} data - Datos del plan BITCOIN/ETHEREUM
 * @param {Function} upgradePlan - Funcion que se ejecuta cuando se hace click en el boton upgrade
 */

const DashboardDetails = ({ plan, data = {}, upgradePlan }) => {
  const PLAN = {
    BITCOIN: 'bitcoin',
  }

  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (data) {
      const valuePorcent = (data.total_paid / (data.amount * 2)) * 100
      setPercentage(valuePorcent)
    }
  }, [data])

  if (data.approved === 0)
    return (
      <article className="card__plan">
        <h1 className="caption">Tu plan se activara cuando sea verificado</h1>
      </article>
    )

  return (
    <article className="card__plan">
      {/*BARRA DE PROGRESO*/}
      <div className="plan__header">
        <div className="plan__name">
          <div
            className={`${
              plan === PLAN.BITCOIN
                ? 'plan__icon--container yellow'
                : 'plan__icon--container skyblue'
            }`}
          >
            {plan === 'bitcoin' ? (
              <BitcoinIcon className="plan__icon icon" color="#ffcb08" />
            ) : (
              <EthereumIcon className="plan__icon icon" color="#9ed3da" />
            )}
          </div>
          <span className="value">Plan {plan}</span>
        </div>

        <div className="plan__group">
          <span className="caption">Fecha inicio</span>
          <span className="plan__value">
            {moment(data?.start_date).format('DD MMM YYYY')}
          </span>
        </div>
      </div>

      {/*BARRA DE PROGRESO*/}
      <div className="plan__two-columns">
        <div className="plan__group left__align">
          <span className="caption">Inversión</span>
          <p className="plan__value bigger">
            {data?.amount}
            {plan === PLAN.BITCOIN ? ' BTC' : ' ETH'}
          </p>
        </div>

        <div className="plan__group">
          <span className="caption">Monto a ganar</span>
          <p className="plan__value bigger">
            {data?.amount_to_win}
            {plan === PLAN.BITCOIN ? ' BTC' : ' ETH'}
          </p>
        </div>
      </div>

      {/*BARRA DE PROGRESO*/}
      <div className="bar__container">
        <div>
          <p className="plan__value">{`Ganado (${percentage.toFixed(1)}%)`}</p>

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
          <span className="plan__value">
            {data?.total_paid} {plan === PLAN.BITCOIN ? ' BTC' : ' ETH'} /{' '}
            {data?.amount_to_win} {plan === PLAN.BITCOIN ? ' BTC' : ' ETH'}
          </span>
        </div>
        <div className="plan__group">
          <span className="caption">Restante</span>
          <span
            className={`${
              plan === PLAN.BITCOIN
                ? 'plan__value yellow'
                : 'plan__value skyblue'
            }`}
          >
            {data?.amount_rest}
            {plan === PLAN.BITCOIN ? ' BTC' : ' ETH'}
          </span>
        </div>
      </div>

      {/*CTA UPGRADE PLAN*/}
      <button
        onClick={upgradePlan}
        className={`${
          plan === PLAN.BITCOIN
            ? 'button upgrade__button yellow'
            : 'button upgrade__button '
        }`}
      >
        UPGRADE
      </button>
    </article>
  )
}

export default DashboardDetails
