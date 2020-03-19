import React, { useState } from "react"

// import Assets
import "./Login.scss"
import Logo from "../../static/images/logo.png"

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="container-login">
      <div className="form-control">
        <img className="img-logo" src={Logo} alt="logo" />

        <div className="row">
          <span>Usuario</span>
          <input onChange={e => setUsername(e.target.value)} autoFocus value={username} type="text" className="text-input" />
        </div>

        <div className="row">
          <span>Contraseña</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="text-input" />

          <a className="password-forgot link">¿Olvido su contraseña?</a>
        </div>

        <div className="row">
          <button className="button">Login</button>
        </div>

        <div className="row">
          <a className="link register">Registarse</a>
        </div>
      </div>
    </div>
  )
}

export default Login