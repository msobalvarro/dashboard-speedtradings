import React, { useState } from 'react'
import moment from 'moment'
import './KycEcommerceForm.scss'

// Import components
import KycEcommerceBeneficialOwner from '../KycEcommerceBeneficialOwner/KycEcommerceBeneficialOwner'

// Import assets
import Countries from '../../utils/countries.json'
import { ReactComponent as UploadIcon } from '../../static/icons/upload.svg'

// Import constants & utils
import { commercialCategories } from '../../utils/constanst'


const KycEcommerceForm = ({
    state={}, 
    setState=_=>{},
    onCancel=_=>{},
    onSubmit=_=>{},
    activeSection=1,
    fieldsValid=false, 
    className='',
}) => {
    // Estados para almacenar las previsualizaciones de las imágenes a subir
    const [businessIdPreview, setBusinessIdPreview] = useState(null)

    // Estado para almacenar la lista de propietarios beneficiarios
    const [beneficialOwnerList, setBeneficialOwnerList] = useState([])

    const [legalRepresentative, setLegalRepresentative] = useState({})

    const [isDiplomatic, setIsDiplomatic] = useState(null)

     /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     * @param {React.setState} dispatch
     */
    const handleLoadPreview = async (e, dispatchPreview, dispatch) => {
        const file = e.target.files[0]

        dispatchPreview(URL.createObjectURL(file))
        dispatch(file)
    }

    return (
        <div className={`KycEcommerceForm ${className}`}>
            {
                // Sección 1 del formulario
                activeSection === 1 &&
                <div className="section">
                    <h2 className="title">Información general</h2>

                    <div className="content">
                        <div className="content-item">
                            {/**
                             * 
                             * Sección de la información básica
                             * 
                             */}
                            <div className="subsection">
                                <h3 className="subtitle">1. Información de la cuenta</h3>

                                <div className="row">
                                    <span className="required">Nombre de usuario</span>
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
                                    <span className="required">Correo electrónico</span>
                                    <input 
                                        value={state.email || ''}
                                        onChange={e => 
                                            setState({...state, email: e.target.value})
                                        }
                                        type="text"
                                        className="text-input"/>
                                </div>
                                
                                <div className="row">
                                    <span className="required">Sitio web (opcional)</span>
                                    <input 
                                        value={state.website || ''}
                                        onChange={e => 
                                            setState({...state, website: e.target.value})
                                        }
                                        type="text" 
                                        className="text-input"/>
                                </div>
                            </div>

                            {/**
                             * 
                             * Sección de la entidad legal
                             * 
                             */}
                            <div className="subsection">
                                <h3 className="subtitle">2. Información de la cuenta</h3>

                                <div className="row">
                                    <span className="required">Nombre de la entidad legal</span>
                                    <input
                                        autoFocus
                                        value={state.nameLegalEntity || ''}
                                        onChange={e => 
                                            setState({...state, nameLegalEntity: e.target.value})
                                        }
                                        type="text"
                                        className="text-input" />
                                </div>

                                <div className="row">
                                    <span className="required">Tipo</span>
                                    <select
                                        value={state.type || -1}
                                        onChange={e => 
                                            setState({...state, type: e.target.value})
                                        }
                                        className="picker">
                                        <option value="-1" disabled hidden>
                                            Seleccione un tipo de comercio
                                        </option>

                                        {
                                            commercialCategories.map((name, index) => (
                                                <option key={index} value={index}>
                                                    {name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                
                                <div className="row">
                                    <span className="required">Número de identificación del negocio</span>
                                    <input 
                                        value={state.businessIdentification || ''}
                                        onChange={e => 
                                            setState({...state, businessIdentification: e.target.value})
                                        }
                                        type="text" 
                                        className="text-input"/>
                                </div>

                                <div className="row horizontal upload-section">
                                    <span className="required">Suba foto de la identificación del negocio</span>

                                    <label
                                        title="Subir archivo"
                                        htmlFor="profile-picture"
                                        className="upload">
                                        <UploadIcon/>
                                    </label>
                                    <input
                                        type="file"
                                        id="profile-picture"
                                        onChange={e => 
                                            handleLoadPreview(
                                                e, 
                                                setBusinessIdPreview,
                                                file => setState({
                                                    ...state, 
                                                    businessIdentificationPicture: file
                                                })
                                            )}
                                        />
                                </div>

                                {
                                    businessIdPreview !== null &&
                                    <div className="row centered">
                                        <img src={businessIdPreview} alt="" className="img-preview"/>
                                    </div>
                                }

                                <div className="row">
                                    <span className="required">Fecha de incorporación</span>
                                    <input 
                                        value={state.incorporationDate || moment(new Date()).format("YYYY-MM-DD")}
                                        onChange={e => 
                                            setState({...state, incorporationDate: e.target.value})
                                        }
                                        type="date" 
                                        className="picker"/>
                                </div>
                            </div>
                        </div>

                        <div className="content-item">
                            {/**
                             * 
                             * Sección de la dirección permanente
                             * 
                             */}
                            <div className="subsection">
                                <h3 className="subtitle">3. Dirección permanente</h3>

                                <div className="row">
                                    <span className="required">País</span>
                                    <select
                                        value={state.country || -1}
                                        onChange={e => 
                                            setState({...state, country: e.target.value})
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
                                <h3 className="subtitle">4. Teléfono</h3>

                                <div className="row">
                                    <span className="required">código del país</span>
                                    <select
                                        value={state.phoneCode || -1}
                                        onChange={e => 
                                            setState({...state, phoneCode: e.target.value})
                                        }
                                        className="picker">
                                        <option value="-1" disabled hidden>
                                            Seleccione un código de país
                                        </option>

                                        {
                                            Countries.map(({name, phoneCode}, index) => (
                                                <option key={index} value={phoneCode}>
                                                    {name} ({phoneCode})
                                                </option>
                                            ))
                                        }
                                    </select>
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
                            </div>

                            <div className="subsection">
                                <h3 className="subtitle">5. País / Región de actividad comercial</h3>

                                <div className="row">
                                    <span className="required">País</span>
                                    <select
                                        value={state.commercialActivityCountry || -1}
                                        onChange={e => 
                                            setState({...state, commercialActivityCountry: e.target.value})
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
                                        value={state.commercialActivityRegion || ''}
                                        onChange={e => 
                                            setState({...state, commercialActivityRegion: e.target.value})
                                        }
                                        type="text" 
                                        className="text-input"/>
                                </div>
                            </div>


                            {/**
                             * 
                             * Sección para mostrar el botón de submit
                             * 
                             */}
                            {
                                false &&
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
            }

            {/**
             * Segunda sección del formulario
             */
                activeSection === 2 &&
                <div className="section">
                    <h2 className="title">Propietarios beneficiarios y agente de control</h2>

                    <div className="content">
                        <div className="content-item beneficiaries">
                            <div className="subsection">
                                <h3 className="subtitle">6. Enumere cada propietario / beneficiario / entidad que posee el 10 por ciento o más de la empresa</h3>

                                <div className="table">
                                    <div className="header">
                                        <span>Titulo y nombre completo</span>
                                        <span>participacion %</span>
                                        <span>fecha de nacimiento</span>
                                        <span>
                                            direccion, ciudad, region, codigo postal, pais
                                        </span>
                                        <span>
                                            numero de pasaporte
                                        </span>
                                        <span>
                                            pais de emision pasaporte
                                        </span>
                                        <span>
                                            No. identificación tributaria
                                        </span>
                                    </div>
                                    <div className="body">
                                        {
                                            beneficialOwnerList.length === 0 &&
                                            <h2 className="empty">
                                                Sin lista de beneficiarios propietarios para mostrar
                                            </h2>
                                        }

                                        {
                                            beneficialOwnerList.map(({
                                                title, name, participation, birthDate, direction, city, region, postalCode, originCountry, passport, passportEmissionCountry, idTax
                                            }, index) => (
                                                <div key={`bo-${index}`} className="row">
                                                    <span>
                                                        {
                                                            `${title}, ${name}`
                                                        }
                                                    </span>

                                                    <span>{ participation } %</span>

                                                    <span>{ birthDate }</span>

                                                    <span>
                                                        {
                                                            `${direction}, ${city}, ${region}, ${postalCode}, ${Countries[originCountry].name}`
                                                        }
                                                    </span>

                                                    <span>{ passport }</span>

                                                    <span>{ Countries[passportEmissionCountry].name}</span>
                                                    <span>{ idTax }</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                <KycEcommerceBeneficialOwner
                                    onSubmit={item => {
                                        setBeneficialOwnerList([
                                            ...beneficialOwnerList, 
                                            item
                                        ])
                                    }}/>
                            </div>

                            <div className="subsection">
                                <p className="paragraph">
                                    a) En los siguientes campos deberá proveer información de una persona con responsabilidad significativa de la entidad legal mencionada anteriormente, como:
                                </p>

                                <label className="check-paragraph">
                                    <input type="checkbox"/>
                                    
                                    <span>
                                        Un director ejecutivo o gerente senior (por ejemplo, director ejecutivo, director financiero, director de operaciones, miembro gerente, socio general, presidente, visepresidente, tesorero);
                                    </span>
                                </label>

                                <label className="check-paragraph">
                                    <input type="checkbox"/>

                                    <span>
                                        Cualquier otro individuo el cual realice labores similares regularmente.
                                    </span>
                                </label>

                                <KycEcommerceBeneficialOwner 
                                    onChange={setLegalRepresentative}/>

                                <p className="paragraph">
                                    b) ¿Alguno de los individuos enumerados anteriormente es una persona políticamente expuesta?

                                    <span className="radios-group">
                                        <label>
                                            <input 
                                                onClick={_ => {
                                                    console.log('true')
                                                    setIsDiplomatic(true)
                                                }}
                                                type="radio" 
                                                name="isDiplomatic"/>
                                            Sí
                                        </label>

                                        <label>
                                            <input 
                                                ocClick={_ => {
                                                    console.log('false')
                                                    setIsDiplomatic(false)
                                                }}
                                                type="radio" 
                                                name="isDiplomatic"/>
                                            No
                                        </label>
                                    </span>
                                </p>

                                <p className="paragraph-comment">
                                    * El término "Persona Políticamente Expuesta" incluye a cualquier individuo (incluidos los miembros de la familia inmediata y los asociados cercanos) que sea un figura política extranjera de  alto rango actual o anterior.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default KycEcommerceForm