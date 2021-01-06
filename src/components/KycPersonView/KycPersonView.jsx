import React from 'react'
import TextGroup from '../TextGroup/TextGroup'
import './KycPersonView.scss'

const KycPersonView = () => {
  return (
    <section className="kyc__person--view">
      <div className="two__rows">
        <div className="card__information">
          <h3 className="card__information--title">Información personal</h3>
          <TextGroup label="Correo" value="al*******@hotmail.com" />
          <TextGroup label="Numero de telefono" value="+507 +507 6850 0810" />
        </div>
        <div className="card__information">
          <h3 className="card__information--title">Beneficiario</h3>

          <TextGroup
            label="Nombre"
            value="Jose Romeo De la Cruz Quintana
"
          />
          <TextGroup label="Parentesco" value="Padre / Madre" />
        </div>
      </div>

      <div className="card__information">
        <h3 className="card__information--title">Nacionalidad y residencia</h3>

        <TextGroup label="Pais de residencia " value="Madrid" />
        <TextGroup label="Ciudad" value="Madrid" />
        <TextGroup label="Codigo postal" value="efranspampa@gmail.com" />
        <TextGroup label="Estado / Provincia / Región" value="Madrid" />
        <TextGroup
          label="Dirección (linea 1)"
          value="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
        <TextGroup
          label="Dirección (linea 2)"
          value="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </div>
    </section>
  )
}

export default KycPersonView
