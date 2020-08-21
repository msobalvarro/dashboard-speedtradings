import jwt from "jwt-simple"
import Axios from "axios"
import copy from "copy-to-clipboard"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const wallets = {
    btc: '188Q7Vw49bhtLY6KEBj21cb7E9nMS3XQAA',
    eth: '0x86CaC6D24d8666d2A990afa4f3E3dAf7e79c8d2d',
    userCoinbase: '@SpeedTradingsBank',
    airtm: 'tradingspeed4@gmail.com',
}

/**
* Método que obtiene los hash de las wallets desde la API,
* recibe el callback de un React.State y almacena dentro del State el objeto con la información
* de las wallets
*/
export const getWallets = async (walletState) => {
    const { data } = await Petition.get('/collection/directions')
    
    // Se recorren los pares de llave:valor de la data obtenida y se construye el objeto final de las wallets
    let walletsData = Object.fromEntries(Object.entries(data).map(entrie => {
        let [coinName, wallet_hash] = entrie

        // Si la entrada contiene subentradas, también se recorren
        if (coinName.toLowerCase() === 'alypay') {
            wallet_hash = Object.fromEntries(Object.entries(wallet_hash).map(subentrie => {
                const [subCoinName, subWallet_hash] = subentrie;

                return [getCoinSymbol(subCoinName), subWallet_hash]
            }))
        }

        return [getCoinSymbol(coinName), wallet_hash]
    }))
    walletState(walletsData);
}

/**
* Método que retorna el simbolo de una moneda según su nombre
* @param {String} coinName
*/
const getCoinSymbol = (coinName) => {
    switch (coinName.toUpperCase()) {
        case 'BITCOIN':
            return 'btc'

        case 'ETHEREUM':
            return 'eth'

        case 'AIRTM':
            return 'airtm'

        case 'ALYPAY':
            return 'alypay'

        default:
            return coinName;
    }
}

// export const urlServer = "https://ardent-medley-272823.appspot.com"
export const urlServer = "http://10.70.12.18:8080"

/**
 * Constante que almacena key secret para recaptcha
 */
export const siteKeyreCaptcha = "6LeTe60ZAAAAAOcLmLZ-I_EXmH1PhQwmw4Td6e3D"

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

/**
* Calcula el precio agregando todos los impuestos
* 
* -- --
* 
* @param {Number} price 
* @param {Number} amount 
*/
export const calculateCryptoPrice = (price = 0, amount = 0) => {
    const prices = amount * price

    // return prices.toFixed(2)

    // Si el precio es menor o igual a 100 USD
    // Aumentaremos 2 USD a la cantidad bruta
    if (prices <= 100) {
        return (prices + 2.5).toFixed(2)
    }

    // Si el precio es mayor a 100 USD y menor a 1,000 USD
    // sumamos el 3% de la cantidad bruta
    if (prices > 100 && prices <= 1000) {
        return (prices + (prices * 0.03)).toFixed(2)
    }


    // Si el precio es mayor a 1,000 USD
    // Sumamos el 2% de la cantidad bruta
    if (prices > 1000) {
        return (prices + (prices * 0.02)).toFixed(2)
    }
}

/**
* Calcula el precio sin añadir los impuestos
* 
* -- --
* 
* @param {Number} price 
* @param {Number} amount
*/
export const calculateCryptoPriceWithoutFee = (price = 0, amount = 0) => {
    return amount * price
}

/**
 * Copy string
 * @param {String} str
*/
export const copyData = async (str = "") => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(str)
    }

    copy(str, {
        message: "Dato copiado",
        onCopy: () => Swal.fire("Listo", "Copiado a portapapeles", "success"),
        debug: true
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
    height: '256px',
    stretch: false
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