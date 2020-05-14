import React from "react"
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import logoPlayStore from "../../static/images/play-store.png"
import "./NavigationBar.scss"
import { useSelector } from "react-redux"


const NavigationBar = () => {
    const { globalStorage } = useSelector(storage => storage)
    const location = window.location.hash


    return (
        <nav className="navigation-bar">
            <div className="content-logo">
                <img src={Logo} className="brand-logo" alt="logo" />
            </div>

            <div className="content-links">
                <Link to="/" className={(location === '#/') ? 'active' : ''}>Dashboard</Link>

                <Link to="/sponsors" className={(location === '#/sponsors') ? 'active' : ''}>Comisiones</Link>

                <a target="_blank" href="https://play.google.com/store/apps/details?id=com.speedtradingsapp" className="app">
                    <span>App</span>
                    <img src={logoPlayStore} className="play-store" alt="logo" />
                </a>

                <Link to="/profile" className={(location === '#/profile') ? 'active' : ''}>{globalStorage.username}</Link>

                <a href="#" onClick={_ => LogOut("/")}>Cerrar sesion</a>
            </div>
        </nav>
    )
}

export default NavigationBar