import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './KycEcommerceBeneficialOwner.scss'

// Import assets
import Countries from '../../utils/countries.json'
import { ReactComponent as UploadIcon } from '../../static/icons/upload.svg'
import { ReactComponent as AddIcon } from '../../static/icons/add.svg'

// Import utils
import { ecommerceValidations } from '../../utils/kycFormValidations'
import { randomKey } from '../../utils/constanst'


const KycEcommerceBeneficialOwner = ({ onSubmit=_=>{}, onChange=null }) => {
    // Estado para almacenar la previsualización de la imagen del pasaporte del propietario beneficiario
    const [passportPicturePreview, setPassportPicturePreview] = useState(null)

    const [state, setState] = useState({})

    const inputFileId = randomKey()

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

    useEffect(_ => {
        if(onChange !== null) {
            onChange(state)
        }
    }, [state])

    return (
        <div className="KycEcommerceBeneficialOwner">
            <div className="item">
                <span>Título del cargo</span>
                <input
                    value={state.title || ''}
                    onChange={e => 
                        setState({...state, title: e.target.value})
                    }
                    type="text"
                    className="text-input"/>
            </div>

            <div className="item">
                <span>Nombre completo</span>
                <input 
                    value={state.name || ''}
                    onChange={e =>
                        setState({...state, name: e.target.value}) 
                    }
                    type="text" 
                    className="text-input"/>
            </div>

            {
                onChange === null &&
                <div className="item">
                    <span>Fecha de nacimiento</span>
                    <input 
                        value={state.birthDate || moment(new Date()).format("YYYY-MM-DD")}
                        onChange={e => 
                            setState({...state, birthDate: e.target.value})
                        }
                        type="date" 
                        className="picker"/>
                </div>
            }

            <div className="item">
                <span>Número de pasaporte</span>
                <input
                    value={state.passport || ''} 
                    onChange={e =>
                        setState({...state, passport: e.target.value})
                    }
                    type="text" 
                    className="text-input"/>
            </div>

            <div className="item">
                <span>País de emisión pasaporte</span>
                <select
                    value={state.passportEmissionCountry || -1}
                    onChange={e => 
                        setState({...state, passportEmissionCountry: e.target.value})
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

            <div className="item">
                <span>País de origen</span>
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

            {
                onChange === null &&
                <>
                    <div className="item">
                        <span>Estado / Provincia / Región</span>
                        <input
                            value={state.region || ''}
                            onChange={e =>
                                setState({...state, region: e.target.value})
                            } 
                            type="text" 
                            className="text-input"/>
                    </div>

                    <div className="item">
                        <span>Ciudad</span>
                        <input 
                            value={state.city || ''}
                            onChange={e =>
                                setState({...state, city: e.target.value})
                            }
                            type="text" 
                            className="text-input"/>
                    </div>
                </>
            }

            <div className="item">
                <span>Dirección</span>
                <input
                    value={state.direction || ''}
                    onChange={e =>
                        setState({...state, direction: e.target.value})
                    } 
                    type="text" 
                    className="text-input"/>
            </div>

            {
                onChange === null &&
                <>
                    <div className="item">
                        <span>Código postal</span>
                        <input
                            value={state.postalCode || ''}
                            onChange={e => 
                                setState({...state, postalCode: e.target.value})
                            } 
                            type="text" 
                            className="text-input"/>
                    </div>

                    <div className="item">
                        <span>Participación (%)</span>
                        <input
                            value={state.participation || ''}
                            onChange={e =>
                                setState({...state, participation: e.target.value})
                            } 
                            type="text" 
                            className="text-input"/>
                    </div>
                </>
            }

            <div className="item">
                <span>No. identificación tributaria</span>
                <input
                    value={state.idTax || ''}
                    onChange={e =>
                        setState({...state, idTax: e.target.value})
                    } 
                    type="text" 
                    className="text-input"/>
            </div>

            {
                onChange !== null &&
                <div className="item">
                    <span>Teléfono</span>
                    <input 
                        value={state.telephone || ''}
                        onChange={e => 
                            setState({...state, telephone: e.target.value})
                        }
                        type="text" 
                        className="text-input"/>
                </div>
            }

            <div className="footer">
                <div className="upload-section">
                    <div className="item horizontal">
                        <span className="required">Adjunte una foto del pasaporte</span>

                        <label
                            title="Subir archivo"
                            htmlFor={`passport-picture-${inputFileId}`}
                            className="upload">
                            <UploadIcon/>
                        </label>
                        <input
                            type="file"
                            id={`passport-picture-${inputFileId}`}
                            onChange={e => 
                                handleLoadPreview(
                                    e, 
                                    setPassportPicturePreview,
                                    file => setState({
                                        ...state, 
                                        passportPicture: file
                                    })
                                )}
                            />
                    </div>

                    {
                        passportPicturePreview !== null &&
                        <img src={passportPicturePreview} alt="" className="img-preview"/>
                    }
                </div>

                {
                    onChange === null &&
                    <button 
                        disabled={!ecommerceValidations.beneficialOwnerItemInfo(state)}
                        onClick={_ => {
                            onSubmit(state)
                            setState({})
                            setPassportPicturePreview(null)
                        }}
                        className="button add-button">
                        Agregar
                        <AddIcon />
                    </button>
                }
            </div>
        </div>
    )
}

export default KycEcommerceBeneficialOwner