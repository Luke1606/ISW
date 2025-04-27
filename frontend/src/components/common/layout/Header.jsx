import { NavLink } from "react-router-dom"
import Modal from "../Modal"
import useHeaderOptions from "../../../hooks/options/useHeaderOptions"
import useDropPopup from "../../../hooks/common/useDropPopup"
import { User } from "lucide-react"
import useAuth from "../../../hooks/Auth/useAuth"
import { useModal } from "../../../hooks/common/useContexts"

/**
 * @description Header de la aplicación que contiene opciones, perfil y botón de `login/logout`.
 * @returns Estructura del header de la aplicación con un perfil popup que contiene la información del usuario y las opciones correspondientes. Además del botón de `login/logout`.
 */
const Header = () => {
    const options = useHeaderOptions()
    const { user, logout } = useAuth()

    const loginModalId = 'loginForm-modal'
    const { openModal } = useModal()

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
                { !user &&
                    <>
                        <button 
                            className="profile-button"
                            title="Autenticar"
                            onClick={() => openModal(loginModalId)}
                            > 
                            Autenticar
                        </button>
                    </>}

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
                                    {user?.pic?
                                        <img className="profile-picture" src={user?.pic} alt="profile-picture" />
                                        :
                                        <div className="profile-picture">
                                            <User size={150} color="rgb(166, 105, 0)" />
                                        </div>
                                    }
                                    <h2>
                                        {user?.name}
                                    </h2>

                                    <h2>
                                        {user?.user_role}
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