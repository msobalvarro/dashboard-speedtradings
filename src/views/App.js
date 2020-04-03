import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// Import Assets
import "@sweetalert2/theme-dark"

// Redux configurations
import { getStorage } from '../utils/constanst'
import { DELETESTORAGE, SETSTORAGE } from '../store/ActionTypes'

// Import Views
import Login from './Login/Login'
import Register from './Register/Register'
import Dashboard from './Dashboard/Dashboard'
import Sponsors from './Sponsors/Sponsors'
import NotFound from './404/404'

const App = () => {
  const dispatch = useDispatch()
  useSelector(({ globalStorage }) => console.log(globalStorage))
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
    <HashRouter>
      <Switch>
        {
          loged
            ?
            <>
              <Route path="/" exact component={Dashboard} />
              <Route path="/sponsors" component={Sponsors} />
              <Route path="*" component={NotFound} />
            </>
            : <Route path="/" exact component={Login} />
        }

        {
          !loged &&
          <>
            <Route path="/register" exact component={Register} />
            <Route path="/register/:username" component={Register} />
            <Route path="*" component={NotFound} />
          </>
        }

      </Switch>
    </HashRouter>
  )
}

export default App
