import React, { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import moment from 'moment'

import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import './ModalDatePicker.scss'

import { DateRange } from 'react-date-range'

const ModalDatePicker = ({ closeModal, onSelect }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  const handleChange = item => {
    setState([item.selection])
  }

  const handleClick = () => {
    const dates = {
      startDate: moment(state[0].startDate).format('YYYY-MM-DD'),
      endDate: moment(state[0].endDate).format('YYYY-MM-DD'),
    }

    onSelect(dates)
    closeModal()
  }

  return (
    <Modal persist={true} onlyChildren>
      <div className="modal__date--container">
        <DateRange
          className="modal__date-picker"
          showMonthArrow={false}
          editableDateInputs={true}
          onChange={handleChange}
          moveRangeOnFirstSelection={false}
          ranges={state}
          scroll={{ enabled: true, calendarHeight: 500 }}
          minDate={new Date('01/06/2020')}
          maxDate={new Date()}
        />
        <div className="modal__date--buttons">
          <button className="button red select-date" onClick={closeModal}>
            Cancelar
          </button>
          <button className="button green select-date" onClick={handleClick}>
            Seleccionar
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDatePicker
