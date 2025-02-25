import {CustomButton} from "../Buttons"
import arrow from "../assets/arrow.gif"

const styles = {
    footer : {
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center", 
        position: "fixed",
        background: "darkorange",
        padding: "0 10px",
        bottom: "0",
        width: "100vw",
        color: "rgb(255, 255, 255, 0.6)"
    },
    button: {
        position: "relative",
        background: "orange",
        border: "1px solid white", 
        padding : "5px",
        marginRight : "40px" 
    },
    icon : {
        transform: "rotate(90deg)",
        objectFit : "cover",
        height : "15px",
        width : "15px",
    }
} 
const Footer = () => {
    return (
        <footer style={styles.footer}>
            <small>
                Universidad de las Ciencias Informáticas. XAUCE. Akademos © 2011-2020
            </small>
            <CustomButton customStyles={styles.button}> 
                <img style={styles.icon} src={arrow} alt="" /> 
            </CustomButton>
        </footer>
    )
}

export default Footer