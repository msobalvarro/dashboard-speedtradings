import React, { useEffect } from "react"
import { useMediaQuery } from "react-responsive"

// import Assets and styles
import "./Mobile.scss"
import logoPlayStore from "../../static/images/play-store.png"
import logo from "../../static/images/logo.png"

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })

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
    const disabledDesktopMode = async () => {
        // document.getElementsByTagName('meta')['viewport'].remove()

        await localStorage.setItem("desktopMode", "true")


        window.location.reload()
    }


    return (
        <Mobile>
            <div className="modal-mobile">
                <img src={logo} className="logo" alt="play store" />

                <a className="card" href="https://play.google.com/store/apps/details?id=com.speedtradingsapp">
                    <img src={logoPlayStore} alt="play store" />

                    <div className="row">
                        <span>Ya disponible</span>
                        <span className="small">Speed Tradings en Play Store</span>
                    </div>
                </a>

                <button className="button secondary" onClick={disabledDesktopMode}>Usar modo escritorio</button>
            </div>
        </Mobile>
    )
}

export default MobileMessage