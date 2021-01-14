import React, { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import { Petition } from '../../utils/constanst'
import { useSesionStorage } from '../../utils/hooks/useSesionStorage'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'

import './ModalTerms.scss'

const Modalterms = ({ closeModal }) => {
  const [terms, setTerms] = useSesionStorage('terms', [])
  const [loader, setLoader] = useState(false)

  const fetchData = async _ => {
    try {
      setLoader(true)

      const { data } = await Petition.get('/terms/api/speedtradings')
      setTerms(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }
  }

  useEffect(_ => {
    //Llamar a los terminos y condiciones solo si no se ha cargado antes
    terms.length === 0 && fetchData()
  }, [])

  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal__terms">
          <div className="two__columns">
            <h2 className="modal__title">Términos y condiciones</h2>
            <CloseIcon className="close__modal--icon" onClick={closeModal} />
          </div>

          {loader && (
            <div className="center__element">
              <ActivityIndicator size={100} />
            </div>
          )}

          {terms.length > 0 &&
            terms.map((paragraph, index) => (
              <p key={index} className="terms__contain">
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </Modal>
  )
}

export default Modalterms
