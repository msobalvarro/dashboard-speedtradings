import jwt from "jwt-simple"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const urlServer = "http://localhost:8080"

/**Opciones para grafica diaria de dashboar */
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