import React, { useEffect, useState } from "react"
import "./ModalTerms.scss"

import { urlServer, Petition } from '../../utils/constanst'

/**
 * @param {Boolean} isVisible - Determina si se muestra o no el componente
 * @param {Callback} onClose - Función a ejecutar cuando se cierra el modal
 */
const ModalTerms = ({ isVisible = false, onClose = () => { } }) => {
    const [page, setPage] = useState('')

    const fetchData = async _ => {
        try {
            const { data } = await Petition.get('/terms/read/speedtradings')

            setPage(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(_ => {
        fetchData()
    }, [])

    if (isVisible) {
        return (
            <div className="modal-terms">
                <button onClick={_ => onClose()} className="button">Cerrar</button>
                <div className='content' dangerouslySetInnerHTML={{ __html: page }}></div>
            </div>
        )
    } else {
        return null
    }
}

export default ModalTerms