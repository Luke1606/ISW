import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { ArrowUpLeftSquare } from 'lucide-react';
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname
    return (
            <div
                className="layout-container">
                <Header />
                    <main className="main-content"
                        >
                        { (currentPath != '/' && currentPath != '/login')&&
                            <button
                                className="back-button"
                                onClick={() => navigate(-1)}
                                title="Volver"
                                >
                                <ArrowUpLeftSquare size={40} color="white" />
                            </button>}
                        <Outlet/>
                    </main> 
                <Footer />
            </div>
        )
}

export default Layout