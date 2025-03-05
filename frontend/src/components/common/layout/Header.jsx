import { useContext } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../../../contexts/UserContext"
import { useHeaderOptions } from "../../../hooks/useOptions"

const Header = () => {
    const options = useHeaderOptions()

    return (
        <header 
            className="header"
            >
            <nav 
                className="header-nav"
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
                                <img 
                                    className="header-option" 
                                    src={option.icon} 
                                    alt={option.title}
                                />
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <Profile/>
            </nav>
        </header>
    )
}

export default Header

const Profile = () => {
    const { user, logout } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    if(!user) {
        return (
            currentPath === "/login"? null 
            :
            <button 
                className="profile-button" 
                onClick={() => navigate("/login")}
                > 
                Autenticar 
            </button>)
    }

    return (
        <div className="profile-container">
            <figure className="profile-figure">
                <img className="profile-picture" src={user.pic} alt="profile-picture" />
            </figure>
            <button className="profile-button" onClick={logout}> Usuario: {user.name} </button>
        </div>
    )
}