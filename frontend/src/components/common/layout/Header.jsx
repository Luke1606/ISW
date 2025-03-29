import { useContext } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import Modal from "../Modal"
import { AuthContext } from "../../../contexts/AuthContext"
import useHeaderOptions from "../../../hooks/options/useHeaderOptions"
import { useDropPopup } from "../../../hooks/common/usePopup"
import { User } from "lucide-react"

const Header = () => {
    const options = useHeaderOptions()
    const { user, logout } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    const popupId = 'header-popup'
    const {
        openerRef,
        dropPopupRef,
        isVisible,
        toggleVisible
    } = useDropPopup(popupId)

    return (
        <header 
            className="header"
            >
            <nav 
                className="header-nav"
                >
                { !user && currentPath !== "/login" &&
                    <button 
                        className="profile-button"
                        title="Autenticar"
                        onClick={() => navigate("/login")}
                        > 
                        Autenticar
                    </button>}

                { user && 
                <>
                    <button 
                        className="profile-button" 
                        onClick={toggleVisible} 
                        data-popup-id={popupId}
                        ref={openerRef} 
                        title="Mostrar perfil y opciones"
                        >
                        <User size={40} color="white" />
                    </button>
                        
                    <Modal
                        isOpen={isVisible}
                        position="top-right"
                        >
                        <div 
                            className="profile-container"
                            data-popup-id={popupId}
                            ref={dropPopupRef}
                            >
                            <ul 
                                className="header-ul"
                                >
                                {options && options.map((option, index) => (
                                    <li 
                                        key={index} 
                                        className="header-li"
                                        >
                                        <NavLink 
                                            to={option.action}
                                            >
                                            <option.icon size={40} color="white"/>
                                        </NavLink>
                                        <span>{option.title}</span>
                                    </li>
                                ))}
                            </ul>

                            <figure className="profile-figure">
                                {user.pic?
                                    <img className="profile-picture" src={user.pic} alt="profile-picture" />
                                    :
                                    <div className="profile-picture">
                                        <User size={150} color="rgb(166, 105, 0)" />
                                    </div>
                                }
                                <h2>
                                    {user.name}
                                </h2>
                            </figure>

                            <button 
                                className="profile-button"
                                title="Cerrar sesión"
                                onClick={logout}
                                >
                                Cerrar Sesión
                            </button>
                        </div>
                    </Modal>
                </>}
            </nav>
        </header>
    )
}

export default Header