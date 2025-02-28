import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../../contexts/UserContext"
import { useHeaderOptions } from "../../../hooks/useOptions"
import icon from "../../../assets/navicon.jpg"

const Header = () => {
    const { options } = useHeaderOptions()
    return (
        <header className="header" style={{backgroundImage : `url(${icon})`}}>
                <nav className="header-nav">
                    <ul className="header-ul">
                        {options.map((option, index) => (
                            <li 
                                key={index} 
                                className="header-li"
                                >
                                <NavLink to={options.action}>
                                    <p>{options.title}</p>
                                    <img 
                                        className="header-option" 
                                        src={option.icon} 
                                        alt={option.title} />
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
    return (
        <div className="profile-container">
            <figure className="profile-figure">
                <img className="profile-picture" src={user.pic} alt="profile-picture" />
            </figure>
            <button className="profileButton" onClick={logout}> Usuario: {user.name} </button>
        </div>
    )
}