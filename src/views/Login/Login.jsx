import React, { useState } from "react"
import Validator from "validator"
import { Link } from 'react-router-dom'
import Swal from "sweetalert2"
import { setStorage, Petition } from "../../utils/constanst"

// redux storage
import { useDispatch } from "react-redux"
import { SETSTORAGE } from "../../store/ActionTypes"

// import Assets
import "./Login.scss"
import Logo from "../../static/images/logo.png"
import alysystem from "../../static/images/alysystem.png"

const Login = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Error state
  const [errEmail, setErrEmail] = useState(false)
  const [errPassword, setErrPassword] = useState(false)

  // Loading state
  const [loading, setLoading] = useState(false)

  const submitLogin = (e) => {
    e.preventDefault()

    // Validamos el correo electronico
    if (Validator.isEmail(email)) {
      // Si el correo es correcto
      setErrEmail(false)

      // Validamos el password
      if (password.length === 0) {
        setErrPassword(true)
      } else {
        // Si todo esta correcto

        ComprobateLogin()
      }
    } else {
      setErrEmail(true)
    }
  }

  /**Create a petition request for get information login */
  const ComprobateLogin = async () => {
    setLoading(true)

    const data = {
      email,
      password
    }

    try {
      await Petition.post(`/login`, data)
        .then(response => {
          if (response.data.error) {
            Swal.fire('Error al auntenticar', response.data.message, 'warning')
          } else {
            console.log(response.data)

            // Ingresamos los datos en el localstorage
            setStorage(response.data)

            dispatch({
              type: SETSTORAGE,
              payload: response.data
            })

            window.location.reload()
          }
        })

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-login">
      <div className="form-control">
        <img className="img-logo" src={Logo} alt="logo" />

        {/* <h2>Inicio de Sesion - Dashboard</h2> */}

        <form action="#" onSubmit={submitLogin}>
          <div className="row">
            {
              errEmail
                ? <span className="error">Email no es Correcto</span>
                : <span>Correo Electronico</span>
            }
            <input required onChange={e => setEmail(e.target.value)} autoFocus value={email} type="email" className="text-input" />
          </div>

          <div className="row">
            {
              errPassword
                ? <span className="error">Contraseña es requerida</span>
                : <span>Contraseña</span>
            }
            <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="text-input" />

            <a className="password-forgot link">¿Olvido su contraseña?</a>
          </div>

          <div className="row">
            <button className="button" type="submit" disabled={loading}>
              Login
            </button>
          </div>

          <div className="row">
            <Link className="link register" to="/register">Registarse</Link>
          </div>

          <div className="row">
            <img src={alysystem} alt="alysystem" className="from" />
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login