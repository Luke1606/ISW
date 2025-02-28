import { Outlet } from "react-router-dom"
import bg from "../../../assets/background.jpg"
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
    return (
            <div 
                className="layout-container" 
                style={{background: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)), url(${bg})` }}>
                <Header />
                    <main>
                            <Outlet />
                    </main> 
                <Footer />
            </div>
            )
}

export default Layout