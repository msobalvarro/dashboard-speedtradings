import React, { useState, useRef } from "react"

// Import styles and assets
import "./ButtonSupport.scss"
import support from "../../static/images/support.png"

const ButtonSupport = () => {
    // Estado par controlar la visivilidad del botón de soporte
    const [visible, setVisible] = useState(false)

    const ref = useRef(null)

    // Función para mostrar el botón de soporte
    const onMouseHover = () => {
        setVisible(true)
    }

    // Función para ocultar el botón de soporte
    const asyncHidden = () => new Promise(() => setTimeout(() => setVisible(false), 250))

    // Cuando el puntero del mouse deja de estar sobre el botón, se esperan 1.5 segundos y se activa la función para ovultar el botón de soporte
    const onMouseLeave = async () => {
        if (ref !== null) {
            ref.current.style.opacity = 0;
    
            asyncHidden().then(() => {
                ref.current.style.opacity = 1;
            })
        }
    }

    return (
        <>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:soporte@alysystem.com?subject=Soporte Dashboard"
                className="button-support"
                onMouseOver={onMouseHover}
                onMouseLeave={onMouseLeave}>

                <img src={support} alt="support" />
            </a>

            {
                visible &&
                <div ref={ref} className={`container-support`}>
                    <span className="label">Escribe un correo para recibir soporte tecnico</span>
                </div>
            }

        </>
    )
}

export default ButtonSupport