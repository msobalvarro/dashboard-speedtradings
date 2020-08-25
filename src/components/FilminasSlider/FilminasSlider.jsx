import React, {useState, useEffect} from 'react'

import "./FilminasSlider.scss"

// Import asset's
import AlyPay from "../../static/images/AlyPay.jpg"
import AlyCoin from "../../static/images/AlyCoin.jpg"
import AlySystem from "../../static/images/AlySystem.jpg"
import SpeedTradings from "../../static/images/SpeedTradings.jpg"
import PlayStore from "../../static/images/playstore.png"
import AppStore from "../../static/images/appstore.png"
import WhatsappQR from "../../static/images/QR.png"


const FilminasSlider = () => {
    const [activeFilmina, setActiveFilmina] = useState(1)

    // Url de las redes sociales
    const twitter = 'https://twitter.com/AlySystem_1?s=09'
    const facebook = 'https://www.facebook.com/AlySystemOficial/'
    const instagram = 'https://instagram.com/alysystem_1?igshid=1gbeiyxfj3i68'
    const telegram = 'https://t.me/joinchat/NUHb5RppOxJX9-EsU041mQ'

    // Url de las apps en las tiendas de playstore y appstore
    const playstoreApps = {
        alypay: 'https://play.google.com/store/apps/details?id=com.alypay',
        speedtradings: 'https://play.google.com/store/apps/details?id=com.speedtradingsapp'
    }
    const appstoreApps = {
        alypay: '#/register',
        speedtradings: '#/register'
    }

    // Controla la transición de las imágenes
    useEffect(() => {
        setTimeout(() => {
            if(activeFilmina === 4) {
                setActiveFilmina(1)
            } else {
                setActiveFilmina(activeFilmina+1)
            }
        }, 10000)
    }, [activeFilmina])


    return (
        <div className='FilminasSlider'>
            <img src={SpeedTradings} alt="" className={`Filmina ${activeFilmina==4 ? 'active' : ''}`}/>
            <img src={AlyPay} alt="" className={`Filmina ${activeFilmina==3 ? 'active' : ''}`}/>
            <img src={AlyCoin} alt="" className={`Filmina ${activeFilmina==2 ? 'active' : ''}`}/>
            <img src={AlySystem} alt="" className={`Filmina ${activeFilmina==1 ? 'active' : ''}`}/>

            <div className='footer'>                     
                <div className='apps-references'>
                    <a
                        href={activeFilmina===3 ? playstoreApps.alypay : playstoreApps.speedtradings}
                        target='_blank'>
                            <img src={PlayStore} alt=""/>
                    </a>

                    <a 
                        href={activeFilmina===3 ? appstoreApps.alypay : appstoreApps.speedtradings}>
                        <img src={AppStore} alt=""/>
                    </a>
                </div>

                <div className='footer-content'>
                    <p>
                        Síguenos en
                        <a href={twitter} target='_blank' className='social-icon twitter'></a>
                        <a href={facebook} target='_blank' className='social-icon facebook'></a>
                        <a href={instagram} target='_blank' className='social-icon instagram'></a>
                        <a href={telegram} target='_blank' className='social-icon telegram'></a>
                    </p>
                    <p>
                        &copy; AlySystem 2020  |  RUC J031000037155
                    </p>
                </div>
            </div>

            <img src={WhatsappQR} alt="" className='whatsapp-qr' />
        </div>
    )
}

export default FilminasSlider