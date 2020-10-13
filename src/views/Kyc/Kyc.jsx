import React, { useState, useEffect } from "react"
import moment from "moment"
import "./Kyc.scss"

// Import components
import KycUserForm from "../../components/KycUserForm/KycUserForm"
import KycEcommerceForm from "../../components/KycEcommerceForm/KycEcommerceForm"

// Import utils
import { userValidations, ecommerceValidations } from "../../utils/kycFormValidations"

// Import assets
import { ReactComponent as BackIcon } from "../../static/icons/arrow-back.svg"
import { ReactComponent as ForwardIcon } from "../../static/icons/arrow-forward.svg"


const Kyc = () => {
    const NOW = moment(new Date(), "YYYY-MM-DD")
    const [USERAGE, setUSERAGE] = useState(18)
    const [activeSection, setActiveSection] = useState(2)

    /**
     * Estados para los campos del formulario de KYC
     */
    // Estados para almacenar la infromación de un usuario natural
    const [userInfo, setUserInfo] = useState({})
    const [tutorInfo, setTutorInfo] = useState({})
    const [beneficiaryInfo, setBeneficiaryInfo] = useState({})

    // Estados para almacenar la información de un comercio
    const [ecommerceInfo, setEcommerceInfo] = useState({})

    /**
     * Verifica que los campos de la sección activa estén completos
     * para poder habilitar el avance a la siguiente sección 
     * @return {Boolean}
     */
    const checkSectionValid = _ => {
        switch(activeSection) {
            // Validaciones para la sección 1
            case 1: 
                //return userValidations.userInfo(userInfo)
                return ecommerceValidations.commerceInfo(ecommerceInfo)

            // Validaciones para la sección 2
            case 2: 
                return userValidations.tutorInfo(tutorInfo)

            // Validaciones para la sección 3
            case 3: 
                return userValidations.beneficiaryInfo(beneficiaryInfo)

            default:
                return false
        }
    }

    /**
     * Muestra la siguiente sección del formulario cuando se presiona el 
     * botón 'siguiente' 
     */
    const nextSection = _ => {
        /**
         * Sí el usuario es menor de edad (es menor de 18 años) se habilita el formulario 
         * del tutor
         */
        let section = (activeSection === 1 && USERAGE < 18)
            ? activeSection + 1
            : activeSection + 1

        setActiveSection(
            (activeSection === 3)
            ? activeSection
            : section
        )
    }

    /**
     * Muestra la sección previa del formulario cuando se presiona el 
     * botón 'siguiente' 
     */
    const prevSection = _ => {
        let section = (activeSection === 3 && USERAGE < 18)
            ? activeSection - 1
            : activeSection - 1

        setActiveSection(
            (activeSection === 1)
            ? activeSection
            : section
        )
    }

    // Se calcula la edad del usuario según cambia la información del usuario
    const calculateUserAge = async _ => {
        if(Object.keys(userInfo) > 0 && userInfo.hasOwnProperty('birthDate')) {
            let fromDate = moment(userInfo.birthDate, "YYYY-MM-DD")
            // Se calcula la edad del usuario
            let userAge = moment.duration(NOW.diff(fromDate)).asYears()

            setUSERAGE(userAge)
        }
    }

    useEffect(_ => {
        calculateUserAge()
    }, [userInfo])

    return (
        <div className="Kyc">
            
            <div className="container">
                {
                    activeSection === 1 && false &&
                    <KycUserForm 
                        state={userInfo}
                        setState={setUserInfo}/>
                }

                {
                    activeSection === 2 && false &&
                    <KycUserForm 
                        state={tutorInfo}
                        setState={setTutorInfo}
                        tutorForm={true}/>
                }

                {
                    activeSection === 3 && false &&
                    <KycUserForm 
                        state={beneficiaryInfo}
                        setState={setBeneficiaryInfo}
                        beneficiaryForm={true}/>
                }

                <KycEcommerceForm 
                    state={ecommerceInfo} 
                    setState={setEcommerceInfo}
                    activeSection={activeSection} />

                <div className="footer">
                    <div className="pager">
                        <button 
                            onClick={prevSection} 
                            style={{opacity: activeSection === 1 ? 0 : 1}}
                            className="back"
                            title="Sección anterior">
                            <BackIcon className="icon" />
                        </button>

                        <div className="pager-dotted">
                            {
                                Array(3).fill(1).map((_, index) => (
                                    <div key={index} className={`dotted ${activeSection === (index+1) ? 'active' : ''}`}></div>
                                ))
                            }
                        </div>

                        <button 
                            disabled={!checkSectionValid()}
                            onClick={nextSection} 
                            style={{opacity: activeSection === 3 ? 0 : 1}}
                            className="forward"
                            title="Siguiente sección">
                            <ForwardIcon className="icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Kyc