import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ArrowUpLeftSquare } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import SideMenu from './SideMenu'
import Modal from '../Modal'
import { useLoading } from "../../../hooks/common/useContexts"

const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    const { loading } = useLoading()
    return (
            <div
                className="layout-container">
                <Modal isOpen={loading}>
                    <span className='spinner'/>
                </Modal>    
                
                <Header />
                    <main className="main-content"
                        >
                        { currentPath != '/' &&
                            <button
                                className="back-button"
                                onClick={() => navigate(-1)}
                                title="Volver"
                                >
                                <ArrowUpLeftSquare size={40} color="white" />
                            </button>}
                        <Outlet/>
                    </main>
                <SideMenu/>
                <Footer />
            </div>
        )
}

export default Layout