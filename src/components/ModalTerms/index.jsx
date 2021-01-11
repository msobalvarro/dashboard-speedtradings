import React from 'react'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as CloseIcon } from '../../static/icons/close.svg'
import './styles.scss'

const Modalterms = ({ closeModal }) => {
  return (
    <Modal persist={true} onlyChildren>
      <div className="overlay">
        <div className="modal__terms">
          <h2 className="modal__title">Términos y condiciones</h2>
          <p className="terms__contain">
            Speed Tradings es una plataforma descentralizada de Inversión a
            través del trading de criptomonedas cuyo objetivo es compartir con
            los usuarios una oportunidad de capitalizar en el mercado bursátil.
          </p>
          <p className="terms__contain">
            Todos los clientes y/o inversores son responsables de la información
            brindada al momento de realizar sus registros en Speed Tradings.
          </p>

          <p className="terms__contain">
            POLÍTICAS DE PRIVACIDAD En Speed Tradings toda la información que el
            inversor suministre será exclusivamente para uso de la compañía.
          </p>
          <p className="terms__contain">
            1. Antes de poder acceder a su perfil, los clientes deberán cumplir
            con los requisitos del formulario KYC en dependencia del tipo de
            cuenta(empresarial o personal), en dicho formulario la información
            debe ser verídica, lógica, responsable y correcta. De no completar
            dicho formulario, no podrá acceder o hacer uso de su cuenta.
          </p>
          <p className="terms__contain">
            2. En caso de extraviar su cuenta, dispondrá de un beneficiario, el
            cual tendrá que ser registrado previamente dentro del formulario
            KYC.
          </p>
          <p className="terms__contain">
            3. Los inversores deben de confirmar que toda la información
            brindada sea correcta.
          </p>
          <p className="terms__contain">
            4. Todos los pagos de intereses devengados por el trading semanal
            serán transferidos únicamente a las wallets de AlyPay, no a wallets
            externas.{' '}
          </p>
          <p className="terms__contain">
            5. Al momento de hacer el envío, el inversor debe de corroborar que
            la wallet que está en el formulario sea la misma que agrega a su
            wallet al momento de hacer el envío, ya que Speed Tradings no se
            hace responsable del envío a wallet incorrecta.{' '}
          </p>
          <p className="terms__contain">
            6. Al momento que el inversor agrega su wallet donde recibirá sus
            ganancias, corroborar que su wallet es la correcta, Speed Tradings
            no se hace responsable de información errónea de su wallet. PRECIOS
            DEL MERCADO Speed Tradings asegura a sus inversores del 0.5% al 1%
            de lunes a viernes del monto de su inversión en la criptomoneda
            invertida, pero no asegura el incremento de precio de la
            criptomoneda invertida. BONO DE REFERIDO En Speed Tradings cuenta
            con el sistema de referidos 3-2-1, sistema mediante el cual usted
            recibe comisiones por referidos en hasta 3 niveles; 3% en el primer
            nivel, 2% en el segundo y 1% en el tercero; pero Speed Tradings Bank
            no se hace responsable de la información brindada de terceros de
            forma errónea. COMISIONES DE RETIRO La compañía cuenta con la App de
            AlyPay en la cual los usuarios envían sus ganancias y no se cobra
            comisión de retiro. Términos y condiciones sujetos a modificaciones
            según lo requiera la empresa.
          </p>

          <button className="button green accept__button" onClick={closeModal}>
            He leído y acepto los términos y condiciones de uso
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Modalterms
