import React, { useState, useRef } from "react"

// Import styles and assets
import "./ButtonSupport.scss"
import support from "../../static/images/support.png"

const ButtonSupport = () => {
    const [visible, setVisible] = useState(false)
    const [transition, setTransition] = useState(false)

    const ref = useRef(null)

    const onMouseHover = () => {
        setVisible(true)
    }

    const asyncHidden = () => new Promise(() => setTimeout(() => setVisible(false), 250))

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
                href="mailto:tradingspeed4@gmail.com?subject=Soporte en el dashboard"
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