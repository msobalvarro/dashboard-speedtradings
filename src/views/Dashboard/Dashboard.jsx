import React from "react"

// Import Assets
import "./Dashboard.scss"

// Import Components
import NavigationBar from "../../components/NavigationBar/NavigationBar"

const Dashboard = () => {
    return (
        <div className="container-dashboard">
            <NavigationBar />

            <h2>Dashboard</h2>
        </div>
    )
}

export default Dashboard