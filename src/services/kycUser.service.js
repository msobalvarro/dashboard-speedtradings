import Countries from "../utils/countries.json"
import { uploadFile, calcAge } from "../utils/constanst"


/**
 * Función que construye el objeto base a enviar al servidor a la hora de almacenar la
 * información kyc de un usuario natural
 * @param {Object} userInfo - Información del usuario ingresada en el formulario kyc 
 * @param {Object} credentials - Credenciales de acceso para realizar peticiones al servidor
 */
export const kycUserData = async (userInfo, credentials) => {
    try {
        // Se obtiene el name, phoneCode, y currency según la nacionalidad
        const userNationality = Countries[userInfo.nationality]

        // Se obtiene el name, phoneCode, y currency según la residencia
        const userResidence = Countries[userInfo.residence]

        // Se almacena en el servidor la imagen de perfil
        const uploadProfilePic = await uploadFile(userInfo.profilePicture, credentials)

        if (uploadProfilePic.error) {
            throw String(uploadProfilePic.message)
        }

        // se almacena en el servidor la foto de la identificación/pasaporte
        const uploadIdentificationPic = await uploadFile(userInfo.IDPicture, credentials)

        if (uploadIdentificationPic.error) {
            throw String(uploadIdentificationPic.message)
        }

        // Se construye el objeto a enviar al servidor con la info del usuario
        return {
            birthday: userInfo.birthday,
            alternativeNumber: userInfo.alternativeNumber,
            nationality: userNationality.name,
            phoneCodeNationality: userNationality.phoneCode,
            currencyNationality: userNationality.code,
            residence: userResidence.name,
            phoneCodeResidence: userResidence.phoneCode,
            currencyResidence: userResidence.code,
            province: userInfo.province,
            city: userInfo.city,
            direction1: userInfo.direction1,
            direction2: userInfo.direction2,
            postalCode: userInfo.postalCode,
            profilePictureId: uploadProfilePic.fileId,
            identificationPictureId: uploadIdentificationPic.fileId,
            ...(
                // Si es mayor de edad, se añaden los campos requeridos para estos
                calcAge(userInfo.birthday) >= 18
                    ? {
                        identificationType: userInfo.identificationType,
                        identificationNumber: userInfo.identificationNumber,
                        foundsOrigin: userInfo.foundsOrigin,
                        estimateMonthlyAmount: userInfo.estimateMonthlyAmount,
                        profession: userInfo.profession
                    }
                    : {}
            )
        }
    } catch (error) {
        return {
            error: error.toString()
        }
    }
}


/**
 * Función que construye el objeto que contiene los datos del beneficiario/tutor de un 
 * usuario natural dentro de un kyc
 * @param {Object} userInfo - Información del usuario ingresada en el formulario kyc 
 * @param {Number} userAge - Edad del usuario kyc
 * @param {Object} credentials - Credenciales de acceso para realizar peticiones al servidor
 */
export const kycUserBeneficiaryData = async (beneficiaryInfo, userAge, credentials) => {
    try {
        // Se obtiene el name, phoneCode, y currency según la nacionalidad
        const beneficiaryNationality = Countries[beneficiaryInfo.nationality]

        // Se obtiene el name, phoneCode, y currency según la residencia
        const beneficiaryResidence = Countries[beneficiaryInfo.residence]

        // Se almacena en el servidor la imagen de perfil
        const uploadProfilePic = await uploadFile(beneficiaryInfo.profilePicture, credentials)

        if (uploadProfilePic.error) {
            throw String(uploadProfilePic.message)
        }

        // se almacena en el servidor la foto de la identificación/pasaporte
        const uploadIdentificationPic = await uploadFile(beneficiaryInfo.IDPicture, credentials)

        if (uploadIdentificationPic.error) {
            throw String(uploadIdentificationPic.message)
        }

        // Datos del beneficiario o tutor del usuario
        return {
            relationship: beneficiaryInfo.relationship,
            firstname: beneficiaryInfo.firstname,
            lastname: beneficiaryInfo.lastname,
            identificationType: beneficiaryInfo.identificationType,
            birthday: beneficiaryInfo.birthday,
            identificationNumber: beneficiaryInfo.identificationNumber,
            principalNumber: beneficiaryInfo.principalNumber,
            alternativeNumber: beneficiaryInfo.alternativeNumber,
            nationality: beneficiaryNationality.name,
            phoneCodeNationality: beneficiaryNationality.phoneCode,
            currencyNationality: beneficiaryNationality.code,
            residence: beneficiaryResidence.name,
            phoneCodeResidence: beneficiaryResidence.phoneCode,
            currencyResidence: beneficiaryResidence.code,
            province: beneficiaryInfo.province,
            city: beneficiaryInfo.city,
            direction1: beneficiaryInfo.direction1,
            direction2: beneficiaryInfo.direction2 || null,
            postalCode: beneficiaryInfo.postalCode,
            foundsOrigin: beneficiaryInfo.foundsOrigin,
            estimateMonthlyAmount: beneficiaryInfo.estimateMonthlyAmount,
            profession: beneficiaryInfo.profession,
            profilePictureId: uploadProfilePic.fileId,
            identificationPictureId: uploadIdentificationPic.fileId,
            tutor: userAge < 18 ? 1 : 0
        }
    } catch (error) {
        return {
            error: error.toString()
        }
    }
}