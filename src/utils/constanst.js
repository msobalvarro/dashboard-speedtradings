import jwt from "jwt-simple"
import Axios from "axios"
import copy from "copy-to-clipboard"
import Swal from "sweetalert2"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const wallets = {
    btc: '1GRpuzgd682hjRH37odhxSDysCREJP5Ecj',
    eth: '0xfc704c539794D2f95cC09C6FEC26C75477c96E25',
    userCoinbase: '@SpeedTradingsBank'
}

export const urlServer = "https://ardent-medley-272823.appspot.com"
// export const urlServer = "http://localhost:8080"

export const getMobileOperatingSystem = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone"
    }

    if (/android/i.test(userAgent)) {
        return "Android"
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS"
    }

    return "unknown"
}

/**
 * Format number with decimal miles separator
 * example: 
 *  * 10000 *(INPUT)*
 *  * 10,000 *(OUTPUT)* 
 * 
 * `return string` */
export const WithDecimals = (number = 0) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const Round = (number = 0) => Math.round(number * 100) / 100

/**Copy string */
export const copyData = (str = "") => {
    copy(str, {
        message: "Dato copiado",
        onCopy: () => Swal.fire("Listo", "Copiado a portapapeles", "success")
    })
}

export const Petition = Axios.create({
    baseURL: urlServer,
    // headers: {
    //     "Content-Type": "application/json"
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

/**Funcion que ejecuta el LOGOUT de sesion */
export const LogOut = async (location = "/") => {
    await deleteStorage()

    await localStorage.removeItem("desktopMode")

    window.location.hash = location

    window.location.reload()
}

/** Elimina el api storage de localstorage */
export const deleteStorage = () => {
    localStorage.removeItem(keyStorage)
}

/**Setea los datos de api storage modo encriptado */
export const setStorage = (json = {}) => {
    const data = jwt.encode(json, keySecret)

    localStorage.setItem(keyStorage, data)
}

/**Desencripta el api storage del dashboard y lo retorna */
export const getStorage = () => {
    const storage = localStorage.getItem(keyStorage)

    if (storage) {
        return jwt.decode(storage, keySecret)
    } else {
        return {}
    }
}