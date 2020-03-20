import React from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"

// Import Assets
import Login from './Login/Login'
import Register from './Register/Register'
import "@sweetalert2/theme-dark"

// Import Views

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Login} />

        <Route path="/register" exact component={Register} />
        <Route path="/register/:username" component={Register} />
      </Switch>
    </HashRouter>
  )
}

export default App
