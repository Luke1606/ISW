import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ArrowUpLeftSquare } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import SideMenu from './SideMenu'
import Modal from '../Modal'
import { useLoading } from '@/logic'

/**
 * @description Marco general de la aplicación, envoltorio general para todas las páginas del sistema.
 * @returns Estructura común para todas las páginas de la aplicación, compuesta por:
 * - Modal que muestra la animación de carga.
 * - `Header`.
 * - `Main`- Contiene la estructura de la página renderizada a partir de la url, además de un botón para volver.
 * - `SideMenu`- Solo es visible si se está en la pantalla de gestión `/list`.
 * - `Footer`.
 */
const Layout = () => {
    const navigate = useNavigate()
    const currentPath = useLocation().pathname

    const { loading } = useLoading()
    return (
            <div
                className='layout-container'
                >
                <Modal isOpen={loading}
                    >
                    <span className='spinner'/>
                </Modal>    
                
                <Header />

                <main 
                    className='main-content'
                    >
                    { currentPath != '/' &&
                        <button
                            className='back-button'
                            onClick={() => navigate(-1)}
                            title='Volver'
                            >
                            <ArrowUpLeftSquare 
                                size={40} 
                                color='white' 
                                />
                        </button>}
                    <Outlet/>
                </main>
                
                <SideMenu/>
                
                <Footer />
            </div>
        )
}

export default Layout