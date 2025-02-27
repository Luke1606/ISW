import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../contexts/AuthProvider"
import icon from "../assets/navicon.jpg"
import opcion1 from "../assets/opcion1.png"
import { CustomButton } from "../Buttons"

const styles = {
    header : {
        width : "100vw",
        top : "0",
        background : "rgb(255,255,255)",
        margin : "0",
        padding : "0",
        position : "fixed",
        boxShadow: "1px 1px 1px darkorange",
        backgroundImage : `url(${icon})`,
        backgroundSize : "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'left',
        display: "flex",
        zIndex : 1
    },
    nav : {
        display: "flex", 
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 10px",
        flexGrow: 1,
    },
    ul : {
        display: "flex",
        flexFlow: "row nowrap", 
        alignItems: "center",
        gap: "4px",
        margin: "0", 
        padding: "0",
    },
    li : {
        listStyle: "none",
        padding: "4px",
    },
    optionIcon : {
        maxWidth: "18px",
        objectFit: "cover",
    }, 
    profile : {
        display: "flex",
        flexFlow: "row nowrap", 
        justifyContent : "center",
        margin: "0", 
        padding: "0",
        background: "rgb(200,200,200)",
    },
    profileFigure : {
        borderRadius : "5%",
        background: "white",
        margin : "4px",
    },
    profilePic : {
        borderRadius : "10%",
        margin : "2px",
        width: "35px",
        height: "35px",
        objectFit : "cover",
    },
    profileButton : {
        margin: "10px",
        border : "none",
        background: "rgb(200,200,200)",
    },
    
}

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext)

    return (
        <header style={styles.header}>
                <nav style={styles.nav}>
                    <ul style={styles.ul}>
                        <li style={styles.li}>
                            <NavLink to="">
                                <img style={styles.optionIcon} src={opcion1} alt="" />
                            </NavLink>
                        </li>

                        <li style={styles.li}>
                            <div style={styles.profile}>
                                <figure style={styles.profileFigure}>
                                    <img style={styles.profilePic} src={user.profilePic} alt="profile-picture" />
                                </figure>
                                <CustomButton customStyles={styles.profileButton} onClick={logoutUser}> Usuario: {user.user} </CustomButton>
                            </div>
                        </li>
                    </ul>
                </nav>
        </header>
    )
}

export default Header