import React from "react"

const BuyPlan = ({ type = "btc" | "eth" }) => {
    return (
        <div className="container-buy-plan">
            <h2>Comprar {type}</h2>
        </div>
    )
}

export default BuyPlan