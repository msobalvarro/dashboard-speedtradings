import jwt from "jwt-simple"
import Axios from "axios"
import { Dispatch } from "redux"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const urlServer = "http://localhost:8080"

export const Petition = Axios.create({
    baseURL: urlServer,
    // headers: {
    //     "content-type": "application/x-www-form-urlencoded"
    // },
    validateStatus: (status) => {
        if (status === 401) {
            LogOut()
        }

        return status >= 200 && status < 300;
    }
})

/**Opciones para grafica diaria de dashboard */
export const optionsChartDashboard = {
    low: 0,
    showArea: true,
    scaleMinSpace: 20,
    height: '256px'
}

export const LogOut = () => {
    deleteStorage()

    window.location.reload()
}

export const deleteStorage = () => {
    localStorage.removeItem(keyStorage)
}

export const setStorage = (json = {}) => {
    const data = jwt.encode(json, keySecret)

    localStorage.setItem(keyStorage, data)
}

export const getStorage = () => {
    const storage = localStorage.getItem(keyStorage)

    if (storage) {
        return jwt.decode(storage, keySecret)
    } else {
        return {}
    }
}