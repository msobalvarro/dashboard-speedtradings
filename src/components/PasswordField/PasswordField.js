import React, {useState} from 'react'

import './PasswordField.scss'


const PasswordField = ({value, onChange, className, ...rest}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)

    const handlClickShowPassword = e => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    const handleInvalid = e => setIsInvalid(true)
    const handleFocus = e => setIsInvalid(false)

    return (
        <fieldset className={`PasswordField ${isInvalid ? 'invalid' : ''} ${className}`}>
            <input
                type={showPassword ? 'text' : 'password'}
                onInvalid={handleInvalid}
                onChange={onChange}
                onFocus={handleFocus}
                value={value} {...rest} />

            <div onClick={handlClickShowPassword} title='Mostrar contraseña' className={!showPassword ? '' : 'hide'}></div>
        </fieldset>
    )
}

export default PasswordField