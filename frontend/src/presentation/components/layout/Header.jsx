import { NavLink } from 'react-router-dom'
import { User } from 'lucide-react'
import { Modal } from '../'
import { 
    useAuth, 
    useModal, 
    useDropPopup,
    useHeaderOptions,
    useTranslateToSpanish 
} from '@/logic'

/**
 * @description Header de la aplicación que contiene opciones obtenidas de {@link useHeaderOptions}, perfil y botón de `login/logout` cuyas funciones obtiene de {@link useAuth}.
 * Si hay un usuario autenticado, se muestra el botón de abrir perfil y el perfil al clickearlo, en caso contrario se muestra el botón de autenticar que abre el formulario de login al clickearlo.
 * @returns Estructura del header de la aplicación con un perfil popup que contiene la información del usuario y las opciones correspondientes. Además del botón de `login/logout`.
 */
const Header = () => {
    const options = useHeaderOptions()
    const { user, logout } = useAuth()

    /**
     * @description Id asociado al modal encargado de renderizar el {@link LoginForm}, se utiliza en las funciones `openModal`, `isOpen` y `closeModal`.
     */
    const loginModalId = 'loginForm-modal'
    const { openModal } = useModal()

    const {
        triggerRef,
        dropPopupRef,
        isVisible,
        toggleVisible
    } = useDropPopup()

    const translate = useTranslateToSpanish()
    const spanishRole = user? translate(user?.user_role) : ''
    return (
        <header 
            className='header'
            >
            <nav 
                className='header-nav'
                >
                { user? 
                    <>
                        <button 
                            className='profile-button' 
                            onClick={toggleVisible} 
                            ref={triggerRef} 
                            title='Mostrar perfil y opciones'
                            >
                            <User size={40} color='white' />
                        </button>
                            
                        <Modal
                            isOpen={isVisible}
                            position='top-right'
                            >
                            <div 
                                className='profile-container'
                                ref={dropPopupRef}
                                >
                                <ul 
                                    className='header-ul'
                                    >
                                    {options && options.map((option, index) => (
                                        <li 
                                            key={index} 
                                            className='header-li'
                                            >
                                            <NavLink 
                                                to={option.action}
                                                >
                                                <option.icon size={40} color='white'/>
                                            </NavLink>
                                            <span>{option.title}</span>
                                        </li>
                                    ))}
                                </ul>

                                <figure className='profile-figure'>
                                    {user?.pic?
                                        <img className='profile-picture' src={user?.pic} alt='profile-picture' />
                                        :
                                        <div className='profile-picture'>
                                            <User size={150} color='rgb(166, 105, 0)' />
                                        </div>
                                    }
                                    <h2>
                                        {user?.name}
                                    </h2>

                                    <h2>
                                        {spanishRole}
                                    </h2>
                                </figure>

                                <button 
                                    className='profile-button'
                                    title='Cerrar sesión'
                                    onClick={logout}
                                    >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </Modal>
                    </>
                    :
                    <button 
                        className='profile-button'
                        title='Autenticar'
                        onClick={() => openModal(loginModalId)}
                        > 
                        Autenticar
                    </button>}

                
            </nav>
        </header>
    )
}

export default Header