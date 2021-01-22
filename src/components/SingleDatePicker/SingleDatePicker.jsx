import React, { useState } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import moment from 'moment'

import { FaCalendarAlt } from 'react-icons/fa'
import Modal from '../Modal/Modal'
import './SingleDatePicker.scss'

const DatePicker = ({ onSelectDate }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [date, setDate] = useState(new Date())

  const handleChangeDate = item => {
    //Cambiar la fecha en la interfaz
    setDate(item)
    //Cerrar modal
    onSelectDate(item)
    setModalIsOpen(false)
  }

  return (
    <>
      <div className="date__selector" onClick={() => setModalIsOpen(true)}>
        {moment(date).format('DD/ MM/ YYYY')}
        <FaCalendarAlt color="#000" />
      </div>

      {modalIsOpen && (
        <Modal persist={true} onlyChildren>
          <Calendar onChange={handleChangeDate} date={date} />
        </Modal>
      )}
    </>
  )
}

export default DatePicker
