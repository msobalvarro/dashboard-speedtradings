import React from "react"
import { Link } from "react-router-dom"
import { LogOut } from "../../utils/constanst"

// Import Assets
import Logo from "../../static/images/logo.png"
import "./NavigationBar.scss"
import { useSelector } from "react-redux"


const NavigationBar = () => {
    const { globalStorage } = useSelector(storage => storage)
    const location = window.location.hash


    return (
        <nav className="navigation-bar">
            <img src={Logo} className="brand-logo" alt="logo" />

            <div className="content-links">
                <Link to="/" className={(location === '#/') ? 'active' : ''}>Dashboard</Link>
                <Link to="/sponsors" className={(location === '#/sponsors') ? 'active' : ''}>Comisiones</Link>
                <a to="#" className="comming-soon">{globalStorage.username}</a>
                <a href="#" onClick={LogOut}>Cerrar sesion</a>
            </div>
        </nav>
    )
}

export default NavigationBar