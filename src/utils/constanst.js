import jwt from "jwt-simple"
import Axios from "axios"
import Swal from "sweetalert2"
import moment from "moment"


// Constanst
const keySecret = "testDevelop"
const keyStorage = "@storage"

export const wallets = {
    btc: '188Q7Vw49bhtLY6KEBj21cb7E9nMS3XQAA',
    eth: '0x86CaC6D24d8666d2A990afa4f3E3dAf7e79c8d2d',
    userCoinbase: '@SpeedTradingsBank',
    airtm: 'tradingspeed4@gmail.com',
}

// Lista preliminar de los tipos de comercios que se mostrarán dentro del kyc
export const commercialCategories = [
    'Abarrotería',
    'Agencia de viaje',
    'Bar',
    'Bazar',
    'Cafetería',
    'Centro comercial',
    'Heladería',
    'Discoteca',
    'Estación de servicio',
    'Ferretería',
    'Almacén',
    'Hotel / Hospedaje',
    'Joyería',
    'Librería',
    'Mercado',
    'Repostería',
    'Restaurante',
    'Tienda',
    'Venta minorista',
    'Otro (especifique)'
]

/**
* Método que obtiene los hash de las wallets desde la API,
* recibe el callback de un React.State y almacena dentro del State el objeto con la información
* de las wallets
*/
export const getWallets = async (walletState) => {
    const { data } = await Petition.get('/collection/directions')

    // Se recorren los pares de llave:valor de la data obtenida y se construye el objeto final de las wallets
    let walletsData = Object.entries(data).map(entrie => {
        let [coinName, wallet_hash] = entrie

        // Si la entrada contiene subentradas, también se recorren
        if (coinName.toLowerCase() === 'alypay') {
            let alypay_wallets = Object.entries(wallet_hash).map(subentrie => {
                const [subCoinName, subWallet_hash] = subentrie

                return [getCoinSymbol(subCoinName), subWallet_hash]
            })

            wallet_hash = fromEntries(alypay_wallets)
        }

        return [getCoinSymbol(coinName), wallet_hash]
    })

    walletsData = fromEntries(walletsData)

    walletState(walletsData)
}

// Construye un objeto a partir de las entradas de uno existente
const fromEntries = (data) => {
    let result = {}

    for (let i = 0; i < data.length; i++) {
        let [key, value] = data[i]
        result[key] = value
    }

    return result
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
            return coinName
    }
}

/**
* Montos mínimos de inversión tanto para BTC como ETH
*/
export const amountMin = {
    btc: 0.002,
    eth: 0.1
}

export const urlServer = "https://ardent-medley-272823.appspot.com"
//export const urlServer = "http://10.70.12.18:8080"

// Límite de subida de los archivos e bytes
export const MAX_FILE_SIZE = 5 * 1024 * 1024

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
 * Return a unique string to use how component key into react
 * */
export const randomKey = _ => ('_' + Math.random().toString(36).substr(2, 9))

/**
 * Creates a function like `round`. Extract from lodash library
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
export const floor = (number, precision) => {
    const func = Math.floor

    precision = precision == null ? 0 : (precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292))

    if (precision) {
        // Shift with exponential notation to avoid floating-point issues.
        // See [MDN](https://mdn.io/round#Examples) for more details.
        let pair = `${number}e`.split('e')
        const value = func(`${pair[0]}e${+pair[1] + precision}`)

        pair = `${value}e`.split('e')
        return +`${pair[0]}e${+pair[1] - precision}`
    }

    return func(number)
}

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
    return (amount * price).toFixed(2)
}

/**
 * Calcula la edad según una fecha
 * @param {String | Date} birthDate - Fecha a evaluar
 */
export const calcAge = (birthDate) => {
    let NOW = moment(new Date(), 'YYYY-MM-DD')
    let fromDate = moment(birthDate, "YYYY-MM-DD")
    // Se calcula la edad
    let age = moment.duration(NOW.diff(fromDate)).asYears()

    return age
}

/**
 * Copy string
 * @param {String} str
*/
export const copyData = async (str = "", msg = "Copiado a portapapeles") => {
    let input = document.createElement('input')

    input.setAttribute('value', str)
    document.body.appendChild(input)
    input.select()

    let result = document.execCommand('copy')
    document.body.removeChild(input)

    if (result) {
        Swal.fire("¡Listo!", msg, "success")
    } else {
        Swal.fire("¡Opps!", "Error al copiar al portapapeles", "error")
    }
}

/**
 * Función para almacenar en el servidor
 * @param {File} file - Foto a almacenar
 */
export const uploadFile = async (file, credentials, update = null) => {
    return new Promise((resolve, reject) => {
        const dataSend = new FormData()

        dataSend.append('image', file)

        if (update !== null) {
            dataSend.append('idFile', update)
        }

        Petition.post('/file/', dataSend, credentials)
            .then(({ data }) => {
                resolve(data)
            }).catch(error => resolve({ error: true, message: error }))
    })
}

/**
 * Función para leer un archivo y retornarlo en base64
 * @param {File} file - Archivo a leer y retornar en base64 
 */
export const readFile = (fileId, credentials) => new Promise(async (resolve, _) => {
    Petition.get(`/file/${fileId}`, {
        responseType: 'arraybuffer',
        ...credentials
    })
        .then(({ data, headers }) => {
            const blob = new Blob([data], { type: headers['content-type'] })

            resolve(blob)
        }).catch(error => resolve({ error: true, message: error }))
})



export const Petition = Axios.create({
    baseURL: urlServer,
    headers: {
        "ignore-release-date": true
    },
    validateStatus: (status) => {
        if (status === 401) {
            console.error("logout")
            LogOut()
        }

        if (status === 426) {
            console.log("actualizar")
        }

        return status >= 200 && status < 300
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
    deleteStorage()

    localStorage.removeItem("desktopMode")

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
