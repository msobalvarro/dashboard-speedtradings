import jwt from "jwt-simple"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const urlServer = "http://localhost:8080"

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