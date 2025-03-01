import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../../contexts/UserContext"
import { useHeaderOptions } from "../../../hooks/useOptions"

const Header = () => {
    const options = useHeaderOptions()

    return (
        <header className="header">
                <nav className="header-nav">
                    <ul className="header-ul">
                        { options.map((option, index) => (
                            <li 
                                key={index} 
                                className="header-li"
                                >
                                <NavLink to={option.action}>
                                    <p>{option.title}</p>
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
    if(!user) {
        return null
    }
    return (
        <div className="profile-container">
            <figure className="profile-figure">
                <img className="profile-picture" src={user.pic} alt="profile-picture" />
            </figure>
            <button className="profileButton" onClick={logout}> Usuario: {user.name} </button>
        </div>
    )
}