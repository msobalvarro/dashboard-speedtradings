import moment from 'moment'

// Import utils
import { calcAge } from "./constanst"

let now = moment(new Date(), 'YYYY-MM-DD').subtract(1, 'd')


/**
 * Validaciones para el formulario kyc para los usuarios naturales
 * @param {Object} userData - Datos del usuario
 * @param {Object} tutorData - Datos del tutor 
 * @param {Object} beneficiaryData - Datos del beneficiario 
 */
const userValidations = {
    userInfo: (userData) => (
        (userData.hasOwnProperty('birthday') && calcAge(userData.birthday) > 0) &&
        (
            (calcAge(userData.birthday) < 18)
                ? true
                : (
                    (userData.hasOwnProperty('identificationType') && userData.identificationType !== -1) &&
                    (userData.hasOwnProperty('identificationNumber') && userData.identificationNumber.length > 0) &&
                    (userData.hasOwnProperty('foundsOrigin') && userData.foundsOrigin !== -1) &&
                    (userData.hasOwnProperty('estimateMounthlyAmount') && userData.estimateMounthlyAmount.length > 0) &&
                    (userData.hasOwnProperty('profession') && userData.profession.length > 0)
                )
        ) &&
        (userData.hasOwnProperty('alternativeNumber') && userData.alternativeNumber.length > 0) &&
        (userData.hasOwnProperty('nationality') && userData.nationality !== -1) &&
        (userData.hasOwnProperty('residence') && userData.residence !== -1) &&
        (userData.hasOwnProperty('province') && userData.province.length > 0) &&
        (userData.hasOwnProperty('city') && userData.city.length > 0) &&
        (
            (userData.hasOwnProperty('direction1') && userData.direction1.length > 0) ||
            (userData.hasOwnProperty('direction2') && userData.direction2.length > 0)
        ) &&
        (userData.hasOwnProperty('postalCode') && userData.postalCode.length > 3) &&
        (userData.hasOwnProperty('profilePicture') && userData.profilePicture !== null) &&
        (userData.hasOwnProperty('IDPicture') && userData.IDPicture !== null)
    ),

    beneficiaryInfo: (beneficiaryData) => (
        (beneficiaryData.hasOwnProperty('firstname') && beneficiaryData.firstname.length > 0) &&
        (beneficiaryData.hasOwnProperty('lastname') && beneficiaryData.lastname.length > 0) &&
        (beneficiaryData.hasOwnProperty('identificationType') && beneficiaryData.identificationType !== -1) &&
        (beneficiaryData.hasOwnProperty('identificationNumber') && beneficiaryData.identificationNumber.length > 0) &&
        (beneficiaryData.hasOwnProperty('birthday') && calcAge(beneficiaryData.birthday) >= 18) &&
        (beneficiaryData.hasOwnProperty('relationship') && beneficiaryData.relationship !== -1) &&
        (beneficiaryData.hasOwnProperty('principalNumber') && beneficiaryData.principalNumber.length > 0) &&
        (beneficiaryData.hasOwnProperty('alternativeNumber') && beneficiaryData.alternativeNumber.length > 0) &&
        (beneficiaryData.hasOwnProperty('nationality') && beneficiaryData.nationality !== -1) &&
        (beneficiaryData.hasOwnProperty('residence') && beneficiaryData.residence !== -1) &&
        (beneficiaryData.hasOwnProperty('province') && beneficiaryData.province.length > 0) &&
        (beneficiaryData.hasOwnProperty('city') && beneficiaryData.city.length > 0) &&
        (
            (beneficiaryData.hasOwnProperty('direction1') && beneficiaryData.direction1.length > 0) ||
            (beneficiaryData.hasOwnProperty('direction2') && beneficiaryData.direction2.length > 0)
        ) &&
        (beneficiaryData.hasOwnProperty('postalCode') && beneficiaryData.postalCode.length > 3) &&
        (beneficiaryData.hasOwnProperty('foundsOrigin') && beneficiaryData.foundsOrigin !== -1) &&
        (beneficiaryData.hasOwnProperty('estimateMonthlyAmount') && beneficiaryData.estimateMonthlyAmount.length > 0) &&
        (beneficiaryData.hasOwnProperty('profession') && beneficiaryData.profession.length > 0) &&
        (beneficiaryData.hasOwnProperty('profilePicture') && beneficiaryData.profilePicture !== null) &&
        (beneficiaryData.hasOwnProperty('IDPicture') && beneficiaryData.IDPicture !== null)
    )
}

const ecommerceValidations = {
    commerceBasicInfo: (commerceData) => (
        (commerceData.hasOwnProperty('name') && commerceData.name.length > 0) &&
        (commerceData.hasOwnProperty('email') && commerceData.email.length > 0) &&
        (commerceData.hasOwnProperty('website') && commerceData.website.length > 0) &&
        (commerceData.hasOwnProperty('nameLegalEntity') && commerceData.nameLegalEntity.length > 0) &&
        (commerceData.hasOwnProperty('type') && commerceData.type !== -1) &&
        (commerceData.hasOwnProperty('businessIdentification') && commerceData.businessIdentification.length > 0) &&
        (commerceData.hasOwnProperty('businessIdentificationPicture') && commerceData.businessIdentificationPicture !== null) &&
        (commerceData.hasOwnProperty('incorporationDate') && Math.floor(moment.duration(moment(commerceData.incorporationDate).diff(now)).asDays()) < 0) &&
        (commerceData.hasOwnProperty('country') && commerceData.country !== -1) &&
        (commerceData.hasOwnProperty('region') && commerceData.region.length > 0) &&
        (commerceData.hasOwnProperty('city') && commerceData.city.length > 0) &&
        (
            (commerceData.hasOwnProperty('direction1') && commerceData.direction1.length > 0) ||
            (commerceData.hasOwnProperty('direction2') && commerceData.direction2.length > 0)
        ) &&
        (commerceData.hasOwnProperty('postalCode') && commerceData.postalCode.length > 0) &&
        (commerceData.hasOwnProperty('mainTelephone') && commerceData.mainTelephone.length > 0) &&

        (commerceData.hasOwnProperty('commercialActivityCountry') && commerceData.commercialActivityCountry !== -1) &&
        (commerceData.hasOwnProperty('commercialActivityRegion') && commerceData.commercialActivityRegion.length > 0)
    ),

    commerceBeneficialInfo: (commerceData) => {
        const {
            beneficialOwnerList,
            legalRepresentative
        } = commerceData

        return (
            (beneficialOwnerList && beneficialOwnerList.length > 0) &&
            (commerceData.hasOwnProperty('typeLegalRepresentative')) &&
            (legalRepresentative && (
                legalRepresentative.title && legalRepresentative.title.length > 0 &&
                legalRepresentative.name && legalRepresentative.name.length > 0 &&
                (
                    (
                        (legalRepresentative.passport && legalRepresentative.passport.length > 0) &&
                        (legalRepresentative.passportEmissionCountry && legalRepresentative.passportEmissionCountry !== -1)
                    ) ||
                    (legalRepresentative.personalId && legalRepresentative.personalId.length > 0)
                ) &&
                (legalRepresentative.originCountry && legalRepresentative.originCountry !== -1) &&
                (legalRepresentative.direction && legalRepresentative.direction.length > 0) &&
                (legalRepresentative.telephone && legalRepresentative.telephone.length > 0) &&
                (
                    (
                        legalRepresentative.passport &&
                        (legalRepresentative.passportPicture && legalRepresentative.passportPicture !== null)
                    ) ||
                    (
                        legalRepresentative.personalId &&
                        (legalRepresentative.personalIdPicture && legalRepresentative.personalIdPicture !== null)
                    )
                )
            )) &&
            (commerceData.hasOwnProperty('isDiplomatic'))
        )
    },

    beneficialOwnerItemInfo: (BOData) => (
        (BOData.hasOwnProperty('title') && BOData.title.length > 0) &&
        (BOData.hasOwnProperty('name') && BOData.name.length > 0) &&
        (BOData.hasOwnProperty('birthDate') && Math.floor(moment.duration(moment(BOData.birthDate).diff(now)).asDays()) < 0) &&
        (
            (
                (BOData.hasOwnProperty('passport') && BOData.passport.length > 0) &&
                (BOData.hasOwnProperty('passportEmissionCountry') && BOData.passportEmissionCountry !== -1)
            ) ||
            (BOData.hasOwnProperty('personalId') && BOData.personalId.length > 0)
        ) &&
        (BOData.hasOwnProperty('originCountry') && BOData.originCountry !== -1) &&
        (BOData.hasOwnProperty('region') && BOData.region !== -1) &&
        (BOData.hasOwnProperty('city') && BOData.city.length > 0) &&
        (BOData.hasOwnProperty('direction') && BOData.direction.length > 0) &&
        (BOData.hasOwnProperty('postalCode') && BOData.postalCode.length > 0) &&
        (BOData.hasOwnProperty('participation') && BOData.participation.length > 0) &&
        //(BOData.hasOwnProperty('idTax') && BOData.idTax.length > 0) &&
        (
            (
                BOData.hasOwnProperty('passport') &&
                (BOData.hasOwnProperty('passportPicture') && BOData.passportPicture !== null)
            ) ||
            (
                BOData.hasOwnProperty('personalId') &&
                (BOData.hasOwnProperty('personalIdPicture') && BOData.personalIdPicture !== null)
            )
        )
    ),

    beneficialOwnerSectionInfo: (BOSInfo) => (
        (BOSInfo.beneficialOwnerList.length > 0)
    )
}

export {
    userValidations,
    ecommerceValidations
}