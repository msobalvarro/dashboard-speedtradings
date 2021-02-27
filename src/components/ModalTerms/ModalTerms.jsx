import React, { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import { Petition } from '../../utils/constanst'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import Logo from '../../static/images/logo.png'

import './ModalTerms.scss'

const Modalterms = ({ closeModal }) => {
    //const [image, setImage] = useState('')
    const [terms, setTerms] = useState([])
    const [loader, setLoader] = useState(false)

    const fetchData = async _ => {
        try {
            setLoader(true)

            const { data } = await Petition.get('/terms/read/speedtradings')

            /* const imgs = data.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
            imgs.length > 0 && setImage(imgs[0]) */

            const text = data.split(/<p>/gm)[1].split(/<\/p>/)[0]

            setTerms(text.split('\n'))
        } catch (error) {
            console.error(error)
        } finally {
            setLoader(false)
        }
    }

    useEffect(_ => {
        //Llamar a los terminos y condiciones solo si no se ha cargado antes
        fetchData()
    }, [])

    return (
        <Modal persist={true} onlyChildren>
            <div className='overlay'>
                <div className='modal__terms'>
                    <div className='two__columns'>
                        <h2 className='modal__title'>Términos y condiciones</h2>
                        <CloseIcon
                            className='close__modal--icon'
                            onClick={closeModal}
                        />
                    </div>

                    {loader && (
                        <div className='center__element'>
                            <ActivityIndicator size={100} />
                        </div>
                    )}

                    {!loader && <img src={Logo} alt='speed tradings' />}

                    {/* <div dangerouslySetInnerHTML={{ __html: image }}></div> */}

                    {terms.length > 0 &&
                        terms.map((paragraph, index) => (
                            <p key={index} className='terms__contain'>
                                {paragraph}
                            </p>
                        ))}
                </div>
            </div>
        </Modal>
    )
}

export default Modalterms
