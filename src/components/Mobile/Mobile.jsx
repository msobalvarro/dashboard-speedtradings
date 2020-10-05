import React, { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import mobileDetect from "mobile-detect"

// import Assets and styles
import "./Mobile.scss"
import logoPlayStore from "../../static/images/play-store.png"
import logoItunes from "../../static/images/itunes.png"
import logo from "../../static/images/logo.png"

/**
 * @param {React.Component} children 
 */
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })

    /**Metodo que verifica si es mobile */
    const calculateResponsive = () => {
        if (isMobile) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    useEffect(() => {
        calculateResponsive()
    }, [isMobile])

    useEffect(() => {
        calculateResponsive()
    }, [])

    return isMobile ? children : null
}

const MobileMessage = () => {
    const [typeDevice, setType] = useState(null)

    const disabledDesktopMode = async () => {
        // document.getElementsByTagName('meta')['viewport'].remove()

        await localStorage.setItem("desktopMode", "true")


        window.location.reload()
    }

    useEffect(() => {
        // Guardamos la configuracion de mobile detect
        // Para confirmar si es un dispositivo movil
        const md = new mobileDetect(window.navigator.userAgent)
        setType(md.os())
    }, [])

    return (
        <Mobile>
            <div className="modal-mobile">
                <img src={logo} className="logo" alt="play store" />

                {
                    // Trajeta que se muestra cuando se detecta el uso de un disposito Android
                    typeDevice === "AndroidOS" &&
                    <a className="card" href="https://play.google.com/store/apps/details?id=com.speedtradingsapp">
                        <img src={logoPlayStore} alt="play store" />

                        <div className="row">
                            <span>Ya disponible</span>
                            <span className="small">Speed Tradings en Play Store</span>
                        </div>
                    </a>
                }

                {
                    // Tarjte que se muestra cuando se detecta el uso de un dispositivo IOS
                    typeDevice === "iOS" &&
                    <a className="card" href="#">
                        <img src={logoItunes} alt="Itunes" />

                        <div className="row">
                            <span>Proximamente</span>
                            <span className="small">Speed Tradings en App Store</span>
                        </div>
                    </a>
                }

                {/** Botón para activar el modo de escritorio */}
                <button className="button secondary" onClick={disabledDesktopMode}>Usar modo escritorio</button>
            </div>
        </Mobile>
    )
}

export default MobileMessage