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
import { ReactComponent as SaveIcon } from "../../static/icons/save.svg"
import { ReactComponent as InformationIcon } from "../../static/icons/information.svg"
import { ReactComponent as EnterpriseIcon } from "../../static/icons/enterprise.svg"
import { ReactComponent as UserIcon } from "../../static/icons/user.svg"
import { ReactComponent as CancelIcon } from "../../static/icons/cancel.svg"


const Kyc = () => {
    const [showIntro, setShowIntro] = useState(true)
    const [showKyc, setShowKyc] = useState(true)
    const [USERAGE, setUSERAGE] = useState(0)
    const [isUser, setIsUser] = useState(false)
    const [activeSection, setActiveSection] = useState(3)

    /**
     * Estados para los campos del formulario de KYC
     */
    // Estados para almacenar la infromación de un usuario natural
    const [userInfo, setUserInfo] = useState({})
    const [beneficiaryInfo, setBeneficiaryInfo] = useState({})

    // Estados para almacenar la información de un comercio
    const [ecommerceInfo, setEcommerceInfo] = useState({})

    /**
     * Verifica que los campos de la sección activa estén completos
     * para poder habilitar el avance a la siguiente sección 
     * @return {Boolean}
     */
    const checkSectionValid = _ => {
        switch (activeSection) {
            // Validaciones para la sección 1
            case 1:
                return isUser
                    ? userValidations.userInfo(userInfo)
                    : ecommerceValidations.commerceBasicInfo(ecommerceInfo)

            // Validaciones para la sección 2
            case 2:
                return isUser
                    ? userValidations.beneficiaryInfo(beneficiaryInfo)
                    : ecommerceValidations.commerceBeneficialInfo(ecommerceInfo)

            // Validaciones para la sección 3
            case 3:
                return false

            default:
                return false
        }
    }

    const checkNextVisibility = () => {
        switch (activeSection) {
            case 1:
                return isUser
                    ? (USERAGE < 18 || userInfo.addBeneficiary)
                    : true

            case 2:
                /**
                 * Si no es el formulario de usuario, se muestra el botón de siguiente
                 * cuando se está en la segunda sección
                 */
                return !isUser

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

    return (
        <div className="Kyc">
            {
                !showKyc &&
                <div className="welcome">
                    {
                        showIntro &&
                        <div className="toshow">
                            <InformationIcon className="indicator" />
                            <p>
                                Para brindarle un mejor servicio y seguriidad a nuestros usuarios, hemos agregado el formulario kyc. Para poder seguir disfutando de <strong>Speed Tradings Bank</strong>, por favor completar la siguiente información
                            </p>

                            <div className="action-buttons">
                                <button className="button back">
                                    Cerrar sesion
                                </button>

                                <button
                                    onClick={_ => setShowIntro(false)}
                                    className="button forward">
                                    Continuar
                                    <ForwardIcon className="icon" />
                                </button>
                            </div>
                        </div>
                    }

                    {
                        !showIntro &&
                        <div className="toshow">
                            <p className="selector-title">Seleccione su tipo de cuenta</p>

                            <div className="action-buttons center">
                                <button
                                    onClick={_ => {
                                        setIsUser(false)
                                        setShowKyc(true)
                                    }}
                                    className="selector">
                                    <EnterpriseIcon className="icon" />
                                    Empresarial
                                </button>

                                <button
                                    onClick={_ => {
                                        setIsUser(true)
                                        setShowKyc(true)
                                    }}
                                    className="selector">
                                    <UserIcon className="icon" />
                                    Personal
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }

            {
                showKyc &&
                <div className="container">
                    {
                        isUser &&
                        <>
                            {
                                activeSection === 1 &&
                                <KycUserForm
                                    state={userInfo}
                                    setState={setUserInfo}
                                    onChangeUserAge={setUSERAGE} />
                            }

                            {
                                activeSection === 2 &&
                                <KycUserForm
                                    state={beneficiaryInfo}
                                    setState={setBeneficiaryInfo}
                                    secondaryTypeForm={USERAGE < 18 ? 1 : 2} />
                            }
                        </>
                    }

                    {
                        !isUser &&
                        <KycEcommerceForm
                            state={ecommerceInfo}
                            setState={setEcommerceInfo}
                            activeSection={activeSection} />
                    }

                    <div className="footer">
                        <div className="pager">
                            {
                                activeSection !== 1 &&
                                <button
                                    onClick={prevSection}
                                    style={{ opacity: activeSection === 1 ? 0 : 1 }}
                                    className="back"
                                    title="Sección anterior">
                                    <BackIcon className="icon" />
                                    Regresar
                                </button>
                            }

                            {
                                activeSection === 1 &&
                                < button
                                    onClick={_ => {
                                        setShowIntro(true)
                                        setShowKyc(false)
                                    }}
                                    className="back cancel">
                                    <CancelIcon className="icon" />
                                    Cancelar
                                </button>
                            }

                            {
                                !isUser &&
                                <div className="pager-dotted">
                                    {
                                        Array(3).fill(1).map((_, index) => (
                                            <div key={index} className={`dotted ${activeSection === (index + 1) ? 'active' : ''}`}></div>
                                        ))
                                    }
                                </div>
                            }

                            {
                                checkNextVisibility() &&
                                <button
                                    disabled={!checkSectionValid()}
                                    onClick={nextSection}
                                    style={{
                                        opacity: (activeSection === 3 && !isUser)
                                            ? 0
                                            : 1
                                    }}
                                    className="forward"
                                    title="Siguiente sección">
                                    Siguiente
                                    <ForwardIcon className="icon" />
                                </button>
                            }

                            {
                                (
                                    (isUser && ((USERAGE >= 18 && !userInfo.addBeneficiary) || activeSection === 2)) ||
                                    (!isUser && activeSection === 3)
                                ) &&
                                < button
                                    disabled={!checkSectionValid()}
                                    onClick={_ => { }}
                                    className="forward">
                                    Guardar
                                    <SaveIcon className="icon" />
                                </button>
                            }
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default Kyc