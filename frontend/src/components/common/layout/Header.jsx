import { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { useHeaderOptions } from "../../../hooks/useOptions";
import { Menu } from "lucide-react"; // Importa el ícono de hamburguesa

const Header = () => {
    const options = useHeaderOptions();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú desplegable

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Alterna la visibilidad del menú
    };

    return (
        <header className="header">
            <nav className="header-nav">
                {/* Icono de hamburguesa (visible solo en modo móvil) */}
                <div className="menu-icon" onClick={toggleMenu}>
                    <Menu size={24} color="#000" />
                </div>

                {/* Menú normal (visible en modo escritorio) */}
                <ul className="header-ul">
                    {options &&
                        options.map((option, index) => (
                            <li key={index} className="header-li">
                                <NavLink to={option.action}>
                                    <img
                                        className="header-option"
                                        src={option.icon}
                                        alt={option.title}
                                    />
                                </NavLink>
                            </li>
                        ))}
                        <Profile />
                </ul>
                
                {/* Menú desplegable (visible solo en modo móvil) */}
                {isMenuOpen && (
                    <ul className="dropdown-menu">
                        {options &&
                            options.map((option, index) => (
                                <li key={index} className="dropdown-item">
                                    <NavLink to={option.action}>{option.title}</NavLink>
                                </li>
                            ))}
                            <Profile />
                    </ul>

                )}
            </nav>
        </header>
    );
};

export default Header;

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    if (!user) {
        return currentPath === "/login" ? null : (
            <button
                className="profile-button"
                onClick={() => navigate("/login")}
            >
                Autenticar
            </button>
        );
    }

    return (
        <div className="profile-container">
            <figure className="profile-figure">
                <img
                    className="profile-picture"
                    src={user.pic}
                    alt="profile-picture"
                />
            </figure>
            <button className="profile-button" onClick={logout}>
                Usuario: {user.name}
            </button>
        </div>
    );
};