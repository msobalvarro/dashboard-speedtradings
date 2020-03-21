import React from "react"

// Import styles
import "./HeaderDashboard.scss"

// Import Assets
import LogoBTC from "../../static/icons/bitcoin.svg"
import LogoETH from "../../static/icons/ether.svg"
import ProgressBar from "../ProgressBar/ProgressBar"

const images = {
    btc: LogoBTC,
    eth: LogoETH,
}

const HeaderDashboard = ({ type = "btc", amount = 0.5, amountToday = 2 }) => {
    const valuePorcent = amountToday / (amount * 2) * 100

    return (
        <div className="container-info-crypto">
            <img src={images[type]} className="crypto" alt="crypto" />

            <div className="info">
                <div className="row">
                    <h1>{amount} {type}</h1>

                    <button className="button large secondary">Upgrade</button>
                </div>

                <div className="row progress">
                    {/* Progress bar */}
                    <ProgressBar value={valuePorcent} legend={`Ganado (${valuePorcent.toFixed(1)}%)`} />
                </div>
            </div>
        </div>
    )
}

export default HeaderDashboard