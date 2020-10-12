import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './KycUserForm.scss'

// Import asset's
import { ReactComponent as UploadIcon } from "../../static/icons/upload.svg"
import Countries from "../../utils/countries.json"

const KycUserForm = ({
    state={}, 
    setState=_=>{},
    onCancel=_=>{},
    onSubmit=_=>{},
    tutorForm=false,
    beneficiaryForm=false,
    fieldsValid=false,
    className=''
}) => {
    const [idFileURL, setIdFileURL] = useState(null)
    const [profileFileURL, setProfileFileURL] = useState(null)

    /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     */
    const handleChangeProfileFile = async (e) => {
        const file = e.target.files[0]

        setProfileFileURL(URL.createObjectURL(file))
        setState({...state, profilePicture: file})
    }

    /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     */
    const handleChangeIdFile = async (e) => {
        const file = e.target.files[0]

        setIdFileURL(URL.createObjectURL(file))
        setState({...state, IDPicture: file})
    }

    useEffect(_ => {
        if(state.hasOwnProperty('profilePicture')) {
            setProfileFileURL(URL.createObjectURL(state.profilePicture))
        }

        if(state.hasOwnProperty('IDPicture')) {
            setIdFileURL(URL.createObjectURL(state.IDPicture))
        }
    }, [])

    return (
        <div className={`KycUserForm ${className}`}>
            <div className="section">
                {
                    (!tutorForm && !beneficiaryForm) &&
                    <h2 className="title">Ingrese su información personal</h2>
                }

                {
                    tutorForm &&
                    <h2 className="title">Ingrese la información de su tutor o representante legal</h2>
                }

                {
                    beneficiaryForm &&
                    <h2 className="title">Ingrese la información de su beneficiario</h2>
                }

                <div className="content">
                    <div className="content-item">
                        {/**
                         * 
                         * Sección de la información básica
                         * 
                         */}
                        <div className="subsection">
                            <h3 className="subtitle">1. Información personal</h3>

                            <div className="row">
                                <span className="required">Nombre(s)</span>
                                <input
                                    autoFocus
                                    value={state.name || ''}
                                    onChange={e => 
                                        setState({...state, name: e.target.value})
                                    }
                                    type="text"
                                    className="text-input" />
                            </div>

                            <div className="row">
                                <span className="required">Apellido(s)</span>
                                <input 
                                    value={state.lastname || ''}
                                    onChange={e => 
                                        setState({...state, lastname: e.target.value})
                                    }
                                    type="text"
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Tipo de identificación</span>

                                <select 
                                    value={state.identificationType || -1}
                                    onChange={e => 
                                        setState({...state, identificationType: e.target.value})
                                    }
                                    className="picker">
                                    <option value="-1" disabled hidden>
                                        Selecciona un tipo de identificación
                                    </option>
                                    <option value="1">Cédula / Credencial</option>
                                    <option value="2">Pasaporte</option>
                                </select>
                            </div>
                            
                            <div className="row">
                                <span className="required">Número de identificación</span>
                                <input 
                                    value={state.identificationValue || ''}
                                    onChange={e => 
                                        setState({...state, identificationValue: e.target.value})
                                    }
                                    type="text" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Fecha de nacimiento</span>
                                <input 
                                    value={state.birthDate || moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={e => 
                                        setState({...state, birthDate: e.target.value})
                                    }
                                    type="date" 
                                    className="picker"/>
                            </div>

                            {
                                (tutorForm || beneficiaryForm) &&
                                <div className="row">
                                    <span className="required">Parentezco</span>

                                    <select 
                                        value={state.relationship || -1}
                                        onChange={e => 
                                            setState({...state, relationship: e.target.value})
                                        }
                                        className="picker">
                                        <option value="-1" disabled hidden>
                                            Selecciona un parentezco
                                        </option>
                                        <option value="1">Parentezco 1</option>
                                        <option value="2">Parentezco 2</option>
                                    </select>
                                </div>
                            }
                        </div>


                        {/**
                         * 
                         * Sección de la subida de archivos
                         * 
                         */}
                        <div className="subsection">
                            <h3 className=" subtitle">2. Foto de perfil y verificación</h3>

                            <div className="row horizontal upload-section">
                                <span className="required">Suba foto de perfil</span>

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

                            <div className="row horizontal upload-section">
                                <span className="required">Suba foto frontal de su ID</span>

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
                                idFileURL !== null &&
                                <div className="row centered">
                                    <img src={idFileURL} alt="" className="img-preview"/>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="content-item">
                        {/**
                         * 
                         * Sección de la nacionalidad y residencia
                         * 
                         */}
                        <div className="subsection">
                            <h3 className="subtitle">3. Nacionalidad y residencia</h3>

                            <div className="row">
                                <span className="required">Nacionalidad</span>
                                <select
                                    value={state.originCountry || -1}
                                    onChange={e => 
                                        setState({...state, originCountry: e.target.value})
                                    }
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
                                    value={state.residentCountry || -1}
                                    onChange={e => 
                                        setState({...state, residentCountry: e.target.value})
                                    }
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
                                <input 
                                    value={state.region || ''}
                                    onChange={e => 
                                        setState({...state, region: e.target.value})
                                    }
                                    type="text" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Ciudad</span>
                                <input 
                                    value={state.city || ''}
                                    onChange={e => 
                                        setState({...state, city: e.target.value})
                                    }
                                    type="text" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Dirección (línea 1)</span>
                                <input
                                    value={state.direction1 || ''}
                                    onChange={e => 
                                        setState({...state, direction1: e.target.value})
                                    }
                                    ype="text" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span>Dirección (línea 2)</span>
                                <input 
                                    value={state.direction2 || ''}
                                    onChange={e => 
                                        setState({...state, direction2: e.target.value})
                                    }
                                    type="text" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Código postal</span>
                                <input 
                                    value={state.postalCode || ''}
                                    onChange={e => 
                                        setState({...state, postalCode: e.target.value})
                                    }
                                    type="text" 
                                    className="text-input"/>
                            </div>
                        </div>
                    </div>

                    <div className="content-item">
                        {/**
                         * 
                         * Sección de la información de contacto
                         * 
                         */}
                        <div className="subsection">
                            <h3 className="subtitle">4. Información de contacto</h3>

                            <div className="row">
                                <span className="required">Correo electrónico</span>
                                <input
                                    value={state.email || ''}
                                    onChange={e => 
                                        setState({...state, email: e.target.value})
                                    }
                                    type="email" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span className="required">Número de teléfono principal</span>
                                <input 
                                    value={state.mainTelephone || ''}
                                    onChange={e => 
                                        setState({...state, mainTelephone: e.target.value})
                                    }
                                    type="tel" 
                                    className="text-input"/>
                            </div>

                            <div className="row">
                                <span>Número de teléfono alternativo</span>
                                <input 
                                    value={state.alternativeTelephone || ''}
                                    onChange={e => 
                                        setState({...state, alternativeTelephone: e.target.value})
                                    }
                                    type="tel" 
                                    className="text-input"/>
                            </div>
                        </div>


                        {/**
                         * 
                         * Sección de la pregunta de control
                         * 
                         */}
                        {
                            (!tutorForm && !beneficiaryForm) &&
                            <div className="subsection">
                                <h3 className="subtitle">5. Pregunta de control</h3>

                                <div className="row">
                                    <span className="required">¿De dónde provienen tus ingresos?</span>
                                    <select 
                                        value={state.foundsOrigin || -1} 
                                        onChange={e => 
                                            setState({...state, foundsOrigin: e.target.value})
                                        }
                                        className="picker">
                                        <option value="-1" disabled hidden>
                                            Seleccione un origen de ingreso
                                        </option>
                                        <option value="0">Ahorros</option>
                                        <option value="1">Herencia</option>
                                        <option value="2">Pensión</option>
                                        <option value="3">Salario</option>
                                        <option value="4">Otro (especifique)</option>
                                    </select>
                                </div>
                            </div>
                        }


                        {/**
                         * 
                         * Sección para mostrar el botón de submit
                         * 
                         */}
                        {
                            beneficiaryForm &&
                            <div className="subsection">
                                <div className="row horizontal">
                                    <button 
                                        onClick={onCancel}
                                        className="button cancel">
                                        Cancelar
                                    </button>

                                    <button
                                        disabled={!fieldsValid}
                                        onClick={onSubmit}
                                        className="button">
                                        Registrar
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KycUserForm;