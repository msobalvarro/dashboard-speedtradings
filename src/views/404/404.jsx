import React from "react"
import "./404.scss"

const NotFound = () => {
    const goHome = () => {
        window.location.href = window.location.origin
    }


    return (
        <div className="container-404">
            <div className="content-info">
                <h1>404</h1>

                <p className="info">Contenido no encontrado</p>

                <div className="buttons">
                    <button className="button secondary" onClick={window.history.back}>Atras</button>
                    <button className="button secondary" onClick={goHome}>Ir a Inicio</button>
                </div>

            </div>

            <div className="content-astronaut">
                <div class="earth-moon">
                    <img class="object_earth" src="http://salehriaz.com/404Page/img/earth.svg" width="100px" />
                    <img class="object_moon" src="http://salehriaz.com/404Page/img/moon.svg" width="80px" />
                </div>

                <img class="object_rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" />
                <img class="object_astronaut" src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px" />

                <div class="glowing_stars">
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                </div>
            </div>


        </div>
    )
}

export default NotFound