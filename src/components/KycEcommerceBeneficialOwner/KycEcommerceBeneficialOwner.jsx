import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Swal from "sweetalert2"
import './KycEcommerceBeneficialOwner.scss'

// Import components
import TelephoneField from "../TelephoneField/TelephoneField"

// Import assets
import Countries from '../../utils/countries.json'
import { ReactComponent as UploadIcon } from '../../static/icons/upload.svg'
import { ReactComponent as AddIcon } from '../../static/icons/add.svg'

// Import utils
import { ecommerceValidations } from '../../utils/kycFormValidations'
import { randomKey, MAX_FILE_SIZE } from '../../utils/constanst'
import {
    nameRegex,
    identificationRegex,
    postalCodeRegex,
    floatRegex
} from '../../utils/regexPatterns'


const KycEcommerceBeneficialOwner = ({ onSubmit = _ => { }, onChange = null }) => {
    // Estado para almacenar la previsualización de la imagen del pasaporte del propietario beneficiario
    const [passportPicturePreview, setPassportPicturePreview] = useState(null)
    // Estado para almacenar la previsualización de la imagen de la cédula
    const [personalIdPreview, setPersonalIdPreview] = useState(null)

    const [state, setState] = useState({})

    const inputFileId = randomKey()

    /**
     * Captura el archivo seleccionado y crea un objectURL para generar una vista previa
     * @param {Event} e 
     * @param {React.setState} dispatch
     */
    const handleLoadPreview = async (e, dispatchPreview, dispatch) => {
        const file = e.target.files[0]

        if (file.size > MAX_FILE_SIZE) {
            Swal.fire('Archivo demasiado grande', '¡Ups! El archivo que intentas subir es demasiado grande, nuestro límite es de 7MB', 'error')
            return
        }

        dispatchPreview(URL.createObjectURL(file))
        dispatch(file)
    }

    useEffect(_ => {
        if (onChange !== null) {
            onChange(state)
        }
    }, [state])

    return (
        <div className="KycEcommerceBeneficialOwner">
            <div className="item">
                <span>Título del cargo</span>
                <input
                    value={state.chargeTitle || ''}
                    onChange={e =>
                        nameRegex(e.target.value)
                            .then(value => setState({ ...state, chargeTitle: value }))
                    }
                    type="text"
                    className="text-input" />
            </div>

            <div className="item">
                <span>Nombre completo</span>
                <input
                    value={state.fullname || ''}
                    onChange={e =>
                        nameRegex(e.target.value)
                            .then(value => setState({ ...state, fullname: value }))
                    }
                    type="text"
                    className="text-input" />
            </div>

            {
                onChange === null &&
                <div className="item">
                    <span>Fecha de nacimiento</span>
                    <input
                        value={state.birthday || moment(new Date()).format("YYYY-MM-DD")}
                        onChange={e =>
                            setState({ ...state, birthday: e.target.value })
                        }
                        type="date"
                        className="picker" />
                </div>
            }

            <div className="item">
                <span>No. identificación personal</span>
                <input
                    value={state.identificationNumber || ''}
                    onChange={e =>
                        identificationRegex(e.target.value)
                            .then(value => setState({ ...state, identificationNumber: value }))
                    }
                    type="text"
                    className="text-input" />
            </div>

            <div className="item">
                <span>Número de pasaporte</span>
                <input
                    value={state.passportNumber || ''}
                    onChange={e =>
                        identificationRegex(e.target.value)
                            .then(value => setState({ ...state, passportNumber: value }))
                    }
                    type="text"
                    className="text-input" />
            </div>

            {
                state.passportNumber && state.passportNumber.length > 0 &&
                < div className="item toshow">
                    <span>País de emisión pasaporte</span>
                    <select
                        value={state.passportEmissionCountry || -1}
                        onChange={e =>
                            setState({ ...state, passportEmissionCountry: e.target.value })
                        }
                        className="picker">
                        <option value="-1" disabled hidden>
                            Seleccione un país
                                </option>

                        {
                            Countries.map(({ name }, index) => (
                                <option key={index} value={index}>
                                    {name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            }

            <div className="item">
                <span>País de origen</span>
                <select
                    value={state.originCountry || -1}
                    onChange={e =>
                        setState({ ...state, originCountry: e.target.value })
                    }
                    className="picker">
                    <option value="-1" disabled hidden>
                        Seleccione un país
                    </option>

                    {
                        Countries.map(({ name }, index) => (
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
                            value={state.province || ''}
                            onChange={e =>
                                nameRegex(e.target.value)
                                    .then(value => setState({ ...state, province: value }))
                            }
                            type="text"
                            className="text-input" />
                    </div>

                    <div className="item">
                        <span>Ciudad</span>
                        <input
                            value={state.city || ''}
                            onChange={e =>
                                nameRegex(e.target.value)
                                    .then(value => setState({ ...state, city: value }))
                            }
                            type="text"
                            className="text-input" />
                    </div>
                </>
            }

            <div className="item">
                <span>Dirección</span>
                <input
                    value={state.direction || ''}
                    onChange={e =>
                        setState({ ...state, direction: e.target.value })
                    }
                    type="text"
                    className="text-input" />
            </div>

            {
                onChange === null &&
                <>
                    <div className="item">
                        <span>Código postal</span>
                        <input
                            value={state.postalCode || ''}
                            onChange={e =>
                                postalCodeRegex(e.target.value)
                                    .then(value => setState({ ...state, postalCode: value }))
                            }
                            type="text"
                            className="text-input" />
                    </div>

                    <div className="item">
                        <span>Participación (%)</span>
                        <input
                            value={state.participationPercentage || ''}
                            onChange={e =>
                                floatRegex(e.target.value)
                                    .then(value => setState({ ...state, participationPercentage: value }))
                            }
                            type="text"
                            className="text-input" />
                    </div>
                </>
            }

            <div className="item">
                <span>No. identificación tributaria (opcional)</span>
                <input
                    value={state.identificationTaxNumber || ''}
                    onChange={e =>
                        identificationRegex(e.target.value)
                            .then(value => setState({ ...state, identificationTaxNumber: value }))
                    }
                    type="text"
                    className="text-input" />
            </div>

            {
                onChange !== null &&
                <div className="item">
                    <span>Teléfono</span>
                    <TelephoneField
                        value={state.telephoneNumber || ''}
                        onChange={value =>
                            setState({ ...state, telephoneNumber: value })
                        } />
                </div>
            }

            <div className="footer">
                <div className="uploads-container">
                    {
                        state.identificationNumber && state.identificationNumber.length > 0 &&
                        <div className="upload-section toshow">
                            <div className="item horizontal">
                                <span className="required">Adjunte una foto su indetificación personal</span>

                                <label
                                    title="Subir archivo"
                                    htmlFor={`personalId-picture-${inputFileId}`}
                                    className="upload">
                                    <UploadIcon />
                                </label>
                                <input
                                    type="file"
                                    accept=".jpeg,.jpg,.jpe,.png"
                                    id={`personalId-picture-${inputFileId}`}
                                    onChange={e =>
                                        handleLoadPreview(
                                            e,
                                            setPersonalIdPreview,
                                            file => setState({
                                                ...state,
                                                identificationPicture: file
                                            })
                                        )}
                                />
                            </div>

                            {
                                personalIdPreview !== null &&
                                <img src={personalIdPreview} alt="" className="img-preview" />
                            }
                        </div>
                    }

                    {
                        state.passportNumber && state.passportNumber.length > 0 &&
                        <div className="upload-section toshow">
                            <div className="item horizontal">
                                <span className="required">Adjunte una foto del pasaporte</span>

                                <label
                                    title="Subir archivo"
                                    htmlFor={`passport-picture-${inputFileId}`}
                                    className="upload">
                                    <UploadIcon />
                                </label>
                                <input
                                    type="file"
                                    accept=".jpeg,.jpg,.jpe,.png"
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
                                <img src={passportPicturePreview} alt="" className="img-preview" />
                            }
                        </div>
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
        </div >
    )
}

export default KycEcommerceBeneficialOwner