import React, { useState } from "react"
import moment from "moment"
import "./Kyc.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"

// Import assets
import { ReactComponent as UploadIcon } from "../../static/icons/upload.svg"
import Countries from "../../utils/countries.json"


const Kyc = () => {
    const [activeSection, setActiveSection] = useState(1)

    const [profileFileURL, setProfileFileURL] = useState(null)
    const [IDFileURL, setIDFileURL] = useState(null)

    /**
     * Estados para los campos del formulario de KYC
     */
    // Section 1
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [identificationType, setIdentificationType] = useState(-1)
    const [identificationValue, setIdenficationValue] = useState('')
    const [birthDate, setBirthDate] = useState(moment(new Date()).format("YYYY-MM-DD"))

    // Section 2
    const [email, setEmail] = useState('')
    const [mainTelephone, setMainTelephone] = useState('')
    const [alternativeTelephone, setAlternativeTelephone] = useState('')

    const [originCountry, setOriginCountry] = useState(-1)
    const [residentCountry, setResidentCountry] = useState(-1)

    /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     */
    const handleChangeProfileFile = (e) => {
        setProfileFileURL(URL.createObjectURL(e.target.files[0]))
    }

    /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     */
    const handleChangeIdFile = (e) => {
        setIDFileURL(URL.createObjectURL(e.target.files[0]))
    }

    /**
     * Verifica que los campos de la sección activa estén completos
     * para poder habilitar el avance a la siguiente sección 
     * @return {Boolean}
     */
    const checkSectionValid = _ => {
        switch(activeSection) {
            // Validaciones para la sección 1
            case 1: 
                let now = moment(new Date(), "YYYY-MM-DD").subtract(1, 'd')

                return (
                    name.length > 0 &&
                    lastname.length > 0 &&
                    setIdentificationType !== -1 &&
                    identificationValue.length > 0 &&
                    Math.floor(moment.duration(moment(birthDate).diff(now)).asDays()) < 0
                )

            // Validaciones para la sección 2
            case 2:
                return (
                    email.length > 0 &&
                    mainTelephone.length > 0 &&
                    alternativeTelephone.length > 0
                )

            default:
                return true
        }
    }

    /**
     * Muestra la siguiente sección del formulario cuando se presiona el 
     * botón 'siguiente' 
     */
    const nextSection = _ => {
        setActiveSection(
            (activeSection === 4)
            ? activeSection
            : activeSection + 1
        )
    }

    /**
     * Muestra la sección previa del formulario cuando se presiona el 
     * botón 'siguiente' 
     */
    const prevSection = _ => {
        setActiveSection(
            (activeSection === 1)
            ? activeSection
            : activeSection - 1
        )
    }

    return (
        <div className="Kyc">
            <NavigationBar/>

            <div className="container">
                <h2>Completa el formulario</h2>

                <div className="content">
                    {   
                        /* Sección 1 - Información personal */
                        activeSection === 1 &&
                        <div className="section">
                            <h3>Información personal</h3>

                            <div className="row">
                                <span className="required">Nombre(s)</span>
                                <input
                                    autoFocus
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    type="text"
                                    className="text-input" />
                            </div>

                            <div className="row">
                                <span className="required">Apellido(s)</span>
                                <input 
                                    value={lastname}
                                    onChange={e => setLastname(e.target.value)}
                                    type="text"
                                    className="text-input"/>
                            </div>

                            <div className="row-group">
                                <div className="col">
                                    <span className="required">Tipo de identificación</span>

                                    <select 
                                        value={identificationType}
                                        onChange={e => setIdentificationType(e.target.value)}
                                        className="picker">
                                        <option value="-1" disabled hidden>
                                            Selecciona un tipo de identificación
                                        </option>
                                        <option value="1">Cédula</option>
                                        <option value="2">Pasaporte</option>
                                    </select>
                                </div>

                                <div className="col">
                                    <span className="required">Número de identificación</span>
                                    <input 
                                        value={identificationValue}
                                        onChange={e => setIdenficationValue(e.target.value)}
                                        type="text" 
                                        className="text-input"/>
                                </div>
                            </div>

                            <div className="row">
                                <span className="required">Fecha de nacimiento</span>
                                <input 
                                    value={birthDate}
                                    onChange={e => setBirthDate(e.target.value)}
                                    type="date" 
                                    className="picker"/>
                            </div>
                        </div>
                    }

                    {
                        /* Sección 2 - Información de cotacto */
                        activeSection === 2 &&
                        <div className="section">
                            <h3>Información de contacto</h3>

                            <div className="row">
                                <span className="required">Correo electrónico</span>
                                <input 
                                    autoFocus 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    type="email" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Número de teléfono principal</span>
                                <input 
                                    valule={mainTelephone}
                                    onChange={e => setMainTelephone(e.target.value)}
                                    type="tel" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span>Número de teléfono alternativo</span>
                                <input 
                                    value={alternativeTelephone}
                                    onChange={e => setAlternativeTelephone(e.target.value)}
                                    type="tel" 
                                    className="text-input"/>
                            </div>
                        </div>
                    }
                    

                    {
                        /* Sección 3 - Nacionalidad y residencia */
                        activeSection === 3 &&
                        <div className="section">
                            <h3>Nacionalidad y residencia</h3>

                            <div className="row">
                                <span className="required">Nacionalidad</span>
                                <select
                                    autoFocus
                                    value={originCountry}
                                    onChange={e => setOriginCountry(e.target.value)}
                                    className="picker">
                                    <option value="-1" disabled hidden>
                                        Seleccione un país
                                    </option>

                                    {
                                        Countries.map(({name}, index) => (
                                            <option key={index} value={index}>
                                                {name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="row">
                                <span className="required">País de residencia</span>
                                <select
                                    value={residentCountry}
                                    onChange={e => setResidentCountry(e.target.value)}
                                    className="picker">
                                    <option value="-1" disabled hidden>
                                        Seleccione un país
                                    </option>

                                    {
                                        Countries.map(({name}, index) => (
                                            <option key={index} value={index}>
                                                {name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="row">
                                <span className="required">Estado / Provincia / Región</span>
                                <input type="text" className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Ciudad</span>
                                <input type="text" className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Dirección (línea 1)</span>
                                <input type="text" className="text-input"/>
                            </div>

                            <div className="row">
                                <span>Dirección (línea 2)</span>
                                <input type="text" className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Código postal</span>
                                <input type="text" className="text-input"/>
                            </div>
                        </div>
                    }


                    {
                        /* Sección 4 - Preguntas de control */
                        activeSection === 4 &&
                        <div className="section">
                            <h3>Preguntas de control</h3>

                            <div className="row">
                                <span className="required">¿De dónde provienen tus ingresos?</span>
                                <select autoFocus defaultValue={-1} className="picker">
                                    <option value="-1" disabled hidden>
                                        Seleccione un origen de ingreso
                                    </option>
                                    <option value="">Ahorros</option>
                                    <option value="">Herencia</option>
                                    <option value="">Pensión</option>
                                    <option value="">Salario</option>
                                    <option value="">Otro (especifique)</option>
                                </select>
                            </div>

                            <div className="row radio-section">
                                <span className="required">¿Eres mayor de edad?</span>

                                <div className="row-group">
                                    <label>
                                        Sí
                                        <input type="radio" name="age-radio"/>
                                    </label>
                                
                                    <label>
                                        No
                                        <input type="radio" name="age-radio"/>
                                    </label>
                                </div>
                            </div>

                            <div className="row radio-section">
                                <span className="required">¿Deseas agregar un beneficiario?</span>

                                <div className="row-group">
                                    <label>
                                        Sí
                                        <input type="radio" name="benefic-radio"/>
                                    </label>
                                
                                    <label>
                                        No
                                        <input type="radio" name="benefic-radio"/>
                                    </label>
                                </div>
                            </div>

                            <h3 className="uploads-section">
                                Foto de perfil y verificación
                            </h3>

                            <div className="row horizontal">
                                <span className="required">Sube una foto de perfil</span>

                                <label
                                    title="Subir archivo"
                                    htmlFor="profile-picture"
                                    className="upload">
                                    <UploadIcon/>
                                </label>
                                <input
                                    type="file"
                                    id="profile-picture"
                                    onChange={handleChangeProfileFile}/>
                            </div>

                            {
                                profileFileURL !== null &&
                                <div className="row centered">
                                    <img src={profileFileURL} alt="" className="img-preview"/>
                                </div>
                            }

                            <div className="row horizontal">
                                <span className="required">Sube una foto frontal de tu documento de identificación</span>

                                <label
                                    title="Subir archivo"
                                    htmlFor="id-picture"
                                    className="upload">
                                    <UploadIcon/>
                                </label>
                                <input
                                    type="file"
                                    id="id-picture"
                                    onChange={handleChangeIdFile}/>
                            </div>

                            {
                                IDFileURL !== null &&
                                <div className="row centered">
                                    <img src={IDFileURL} alt="" className="img-preview"/>
                                </div>
                            }
                        </div>
                    }
                    
                </div>

                <div className="buttons-group">
                    <button
                        onClick={prevSection}
                        style={{ opacity: activeSection === 1 ? 0 : 1 }}>
                        Anterior
                    </button>
                    <button
                        disabled={!checkSectionValid()}
                        onClick={nextSection}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Kyc