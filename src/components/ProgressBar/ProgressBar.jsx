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
        </div>
    )
}

export default ProgressBar