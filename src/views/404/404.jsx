import React from "react"
import "./404.scss"

// Import Assets 
import astronaut from "../../static/images/not-found/astronaut.svg"
import earth from "../../static/images/not-found/earth.svg"
import moon from "../../static/images/not-found/moon.svg"
import rocket from "../../static/images/not-found/rocket.svg"

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
                    <img class="object_earth" src={earth} width="100px" />
                    <img class="object_moon" src={moon} width="80px" />
                </div>

                <img class="object_rocket" src={rocket} width="40px" />
                <img class="object_astronaut" src={astronaut} width="140px" />

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