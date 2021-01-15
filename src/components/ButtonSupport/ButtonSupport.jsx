import React, { useState, useRef } from 'react'
import { ReactComponent as WhatsappIcon } from '../../static/icons/whatsapp.svg'

// Import styles and assets
import './ButtonSupport.scss'
import support from '../../static/images/support.png'

const ButtonSupport = () => {
  return (
    <div className="container-support">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://wa.me/+50585570529"
        className="button-support"
      >
        <WhatsappIcon className="support__icon" />
      </a>
      <span className="label tooltip">
        Escribe un mensaje a soporte tecnico
      </span>
    </div>
  )
}

export default ButtonSupport
