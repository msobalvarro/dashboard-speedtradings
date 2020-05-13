import React from "react"
import "./ModalTerms.scss"


const ModalTerms = ({ isVisible = false, onClose = () => { } }) => {
    if (isVisible) {
        return (
            <div className="modal-terms">
                <button id="closeCondiciones" onClick={onClose}>Cerrar</button>

                <h2>Terminos y condiciones</h2>

                <p>
                    Speed Tradings es una plataforma descentralizada de Inversión a través del trading de criptomonedas cuyo
                    objetivo es compartir con los usuarios una oportunidad de capitalizar en el mercado bursátil. Todos los
                    clientes y/o inversores son responsables de la información brindada al momento de realizar sus registros en
                    Speed Tradings.
                </p>

                <h2>POLITICAS DE PRIVACIDAD</h2>

                <p>
                    En Speed Tradings toda la información que el inversor suministre será exclusivamente para uso de la
                    compañía.

                    <ol>
                        <li>
                            Los inversores deben de confirmar que toda la información brindada sea correcta.
                        </li>
                        <li>
                            Al momento de hacer el envío, el inversor debe de corroborar que la wallet que está en el formulario sea
                            la misma que agrega a su wallet al momento de hacer el envío, ya que Speed Tradings no se hace responsable
                            del envío a wallet incorrecta.
                        </li>

                        <li>
                            Al momento que el inversor agrega su wallet donde recibirá sus ganancias, corroborar que su wallet es la
                            correcta, Speed Tradings no se hace responsable de información errónea de su wallet.
                        </li>
                    </ol>
                </p>

                <h2>PRECIOS DEL MERCADO</h2>

                <p>
                    Speed Tradings asegura a sus inversores del 0.5% al 1% de lunes a viernes del monto de su inversión en la
                    criptomoneda invertida, pero no asegura el incremento de precio de la criptomoneda invertida.
                </p>

                <h2>BONO DE REFERIDO</h2>

                <p>
                    En Speed Tradings cuenta con el bono de referido directo pero no se hace responsable de la información
                    brindada de terceros de forma erronea.
                </p>

                <p>
                    Terminos y condiciones sujetos a modificaciones segun lo requiera la empresa.
                </p>
            </div>
        )
    } else {
        return null
    }
}

export default ModalTerms