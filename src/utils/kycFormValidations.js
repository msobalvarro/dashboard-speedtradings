import moment from 'moment'

let now = moment(new Date(), 'YYYY-MM-DD').subtract(1, 'd')

/**
 * Validaciones para el formulario kyc para los usuarios naturales
 * @param {Object} userData - Datos del usuario
 * @param {Object} tutorData - Datos del tutor 
 */
const userValidations = {
    userInfo: (userData) => (
        (userData.hasOwnProperty('name') && userData.name.length > 0) &&
        (userData.hasOwnProperty('lastname') && userData.lastname.length > 0) &&
        (userData.hasOwnProperty('identificationType') && userData.identificationType !== -1) &&
        (userData.hasOwnProperty('identificationValue') && userData.identificationValue.length > 0) &&
        (userData.hasOwnProperty('birthDate') && Math.floor(moment.duration(moment(userData.birthDate).diff(now)).asDays()) < 0) &&
        (userData.hasOwnProperty('email') && userData.email.length > 0) &&
        (userData.hasOwnProperty('mainTelephone') && userData.mainTelephone.length > 0) &&
        (userData.hasOwnProperty('alternativeTelephone') && userData.alternativeTelephone.length > 0) &&
        (userData.hasOwnProperty('originCountry') && userData.originCountry !== -1) &&
        (userData.hasOwnProperty('residentCountry') && userData.residentCountry !== -1) &&
        (userData.hasOwnProperty('region') && userData.region.length > 0) &&
        (userData.hasOwnProperty('city') && userData.city.length > 0) &&
        ( 
            (userData.hasOwnProperty('direction1') && userData.direction1.length > 0) || 
            (userData.hasOwnProperty('direction2') && userData.direction2.length > 0)
        ) &&
        (userData.hasOwnProperty('postalCode') && userData.postalCode.length > 3) &&
        (userData.hasOwnProperty('foundsOrigin') && userData.foundsOrigin !== -1) &&
        (userData.hasOwnProperty('profilePicture') && userData.profilePicture !== null) &&
        (userData.hasOwnProperty('IDPicture') && userData.IDPicture !== null)
    ),

    tutorInfo: (tutorData) => (
        (tutorData.hasOwnProperty('name') && tutorData.name.length > 0) &&
        (tutorData.hasOwnProperty('lastname') && tutorData.lastname.length > 0) &&
        (tutorData.hasOwnProperty('identificationType') && tutorData.identificationType !== -1) &&
        (tutorData.hasOwnProperty('identificationValue') && tutorData.identificationValue.length > 0) &&
        (tutorData.hasOwnProperty('birthDate') && Math.floor(moment.duration(moment(tutorData.birthDate).diff(now)).asDays()) < 0) &&
        (tutorData.hasOwnProperty('relationship') && tutorData.relationship !== -1) &&
        (tutorData.hasOwnProperty('email') && tutorData.email.length > 0) &&
        (tutorData.hasOwnProperty('mainTelephone') && tutorData.mainTelephone.length > 0) &&
        (tutorData.hasOwnProperty('alternativeTelephone') && tutorData.alternativeTelephone.length > 0) &&
        (tutorData.hasOwnProperty('originCountry') && tutorData.originCountry !== -1) &&
        (tutorData.hasOwnProperty('residentCountry') && tutorData.residentCountry !== -1) &&
        (tutorData.hasOwnProperty('region') && tutorData.region.length > 0) &&
        (tutorData.hasOwnProperty('city') && tutorData.city.length > 0) &&
        ( 
            (tutorData.hasOwnProperty('direction1') && tutorData.direction1.length > 0) || 
            (tutorData.hasOwnProperty('direction2') && tutorData.direction2.length > 0)
        ) &&
        (tutorData.hasOwnProperty('postalCode') && tutorData.postalCode.length > 3) &&
        (tutorData.hasOwnProperty('profilePicture') && tutorData.profilePicture !== null) &&
        (tutorData.hasOwnProperty('IDPicture') && tutorData.IDPicture !== null)
    ),

    beneficiaryInfo: (beneficiaryData) => (
        (beneficiaryData.hasOwnProperty('name') && beneficiaryData.name.length > 0) &&
        (beneficiaryData.hasOwnProperty('lastname') && beneficiaryData.lastname.length > 0) &&
        (beneficiaryData.hasOwnProperty('identificationType') && beneficiaryData.identificationType !== -1) &&
        (beneficiaryData.hasOwnProperty('identificationValue') && beneficiaryData.identificationValue.length > 0) &&
        (beneficiaryData.hasOwnProperty('birthDate') && Math.floor(moment.duration(moment(beneficiaryData.birthDate).diff(now)).asDays()) < 0) &&
        (beneficiaryData.hasOwnProperty('relationship') && beneficiaryData.relationship !== -1) &&
        (beneficiaryData.hasOwnProperty('email') && beneficiaryData.email.length > 0) &&
        (beneficiaryData.hasOwnProperty('mainTelephone') && beneficiaryData.mainTelephone.length > 0) &&
        (beneficiaryData.hasOwnProperty('alternativeTelephone') && beneficiaryData.alternativeTelephone.length > 0) &&
        (beneficiaryData.hasOwnProperty('originCountry') && beneficiaryData.originCountry !== -1) &&
        (beneficiaryData.hasOwnProperty('residentCountry') && beneficiaryData.residentCountry !== -1) &&
        (beneficiaryData.hasOwnProperty('region') && beneficiaryData.region.length > 0) &&
        (beneficiaryData.hasOwnProperty('city') && beneficiaryData.city.length > 0) &&
        ( 
            (beneficiaryData.hasOwnProperty('direction1') && beneficiaryData.direction1.length > 0) || 
            (beneficiaryData.hasOwnProperty('direction2') && beneficiaryData.direction2.length > 0)
        ) &&
        (beneficiaryData.hasOwnProperty('postalCode') && beneficiaryData.postalCode.length > 3) &&
        (beneficiaryData.hasOwnProperty('profilePicture') && beneficiaryData.profilePicture !== null) &&
        (beneficiaryData.hasOwnProperty('IDPicture') && beneficiaryData.IDPicture !== null)
    )
}

export {
    userValidations
}