import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
    return (
            <div 
                className="layout-container">
                <Header />
                    <main>
                        <Outlet className="main-content"/>
                    </main> 
                <Footer />
            </div>
        )
}

export default Layout