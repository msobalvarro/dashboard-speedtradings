import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from '../../utils/constanst'

// Import Assets
import Logo from '../../static/images/logo.png'
import logoPlayStore from '../../static/images/play-store.png'
import { ReactComponent as ArrowIcon } from '../../static/icons/arrow-back.svg'
import './NavigationBar.scss'
import { useSelector } from 'react-redux'
import { Spin as HamburgerMenu } from 'hamburger-react'

//Import hook
import { useWindowWidth } from '../../utils/hooks/useWindowWidth '

const NavigationBar = () => {
  const { globalStorage } = useSelector(storage => storage)
  const location = window.location.hash

  const [showMore, setShowMore] = useState(false)
  const showMoreContainerRef = useRef(null)

  const windowWidth = useWindowWidth()
  const [showMenu, setShowMenu] = useState(false)

  const breakpoint = 768

  // Detect blur for component to hide option list
  const handleBlur = e => {
    if (!showMoreContainerRef.current.contains(e.target) && showMore) {
      setShowMore(false)
    }
  }

  useEffect(_ => {
    window.addEventListener('click', handleBlur)

    return _ => {
      window.removeEventListener('click', handleBlur)
    }
  })

  //Obtener el ancho de la ventana del navegador
  useEffect(() => {
    windowWidth > breakpoint ? setShowMenu(true) : setShowMenu(false)
  }, [windowWidth])

  return (
    <nav className="navigation-bar">
      {/** Logo */}
      <div className="content-logo">
        <img src={Logo} className="brand-logo" alt="logo" />
      </div>

      {/** Elementos de navegación */}

      <div
        className={`${
          showMenu ? 'overlay__navbar visible' : 'overlay__navbar'
        }`}
      >
        <div className="content-links">
          <Link to="/" className={location === '#/' ? 'active' : ''}>
            Dashboard
          </Link>

          <Link
            to="/sponsors"
            className={location === '#/sponsors' ? 'active' : ''}
          >
            Comisiones
          </Link>

          <button
            onClick={_ => setShowMore(!showMore)}
            className={`dropdown ${showMore ? 'active' : ''}`}
          >
            <span>{globalStorage.username}</span>
            <ArrowIcon className="arrow" />
          </button>

          <div
            ref={showMoreContainerRef}
            className={`dropdown-content ${showMore ? 'active' : ''}`}
          >
            <Link
              to="/profile"
              className={location === '#/profile' ? 'active' : ''}
            >
              Ver perfil
            </Link>

            <a href="#" onClick={_ => LogOut('/')}>
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>

      {windowWidth < breakpoint && (
        <HamburgerMenu
          toggled={showMenu}
          toggle={setShowMenu}
          size={28}
          color="#fff"
        />
      )}
    </nav>
  )
}

export default NavigationBar
