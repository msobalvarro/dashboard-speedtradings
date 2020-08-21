import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"
import { useDispatch } from "react-redux"

// Import Assets
import "@sweetalert2/theme-dark"

// Redux configurations
import { getStorage} from '../utils/constanst'
import { DELETESTORAGE, SETSTORAGE } from '../store/ActionTypes'

// Import Components
import ButtonSupport from '../components/ButtonSupport/ButtonSupport'

// Import Views
import Login from './Login/Login'
import Register from './Register/Register'
import Dashboard from './Dashboard/Dashboard'
import Sponsors from './Sponsors/Sponsors'
import Profile from './Profile/Profile'
import NotFound from './404/404'
import Reset from './Reset/Reset'

const App = () => {
  const dispatch = useDispatch()
  const [loged, setLogin] = useState(false)

  useEffect(() => {
    const payload = getStorage()

    // Comprueba si hay datos retornados en el payload
    if (Object.keys(payload).length > 0) {

      // Creamos el dispatch para el storage de redux
      dispatch({
        type: SETSTORAGE,
        payload
      })

      // Le decimos que el usuario esta logueado
      setLogin(true)
    } else {
      setLogin(false)
      // Destruimos el sorage
      dispatch({ type: DELETESTORAGE })
    }
  }, [])

  return (
    <>
      <HashRouter>
        {
          loged &&
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/sponsors" component={Sponsors} />
            <Route path="/profile" component={Profile} />
            <Route path="*" component={NotFound} />
          </Switch>

        }

        {
          !loged &&
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/register/:username" component={Register} />
            <Route path="/reset/password" component={Reset} />
            <Route path="*" component={NotFound} />
          </Switch>
        }
      </HashRouter>

      <ButtonSupport />
    </>
  )
}

export default App
