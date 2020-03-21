import React from "react"
import "./ProgressBar.scss"

const ProgressBar = ({ value = 100, legend = "cargando.." }) => {
    return (
        <div className="progress-bar">
            <div className="value" style={{ width: `${value}%` }}>
                {
                    value >= 40 &&
                    <span>{legend}</span>
                }
            </div>

            {
                value < 40 &&
                <span className="value-legend">{legend}</span>
            }

        </div>
    )
}

export default ProgressBar