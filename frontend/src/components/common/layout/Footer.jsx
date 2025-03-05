import { Link } from "react-router-dom"
import arrow from "/arrow.gif"


const Footer = () => {
    return (
        <footer className="footer">
            <small className="footer-content">
                Universidad de las Ciencias Informáticas. XAUCE. Akademos © 2011-2020
            </small>
            
            <div className="social-icons">
                <Link href="#">
                    <i className="fab fa-facebook-f"></i>
                </Link>
                <Link href="#">
                    <i className="fab fa-twitter"></i>
                </Link>
                <Link href="#">
                    <i className="fab fa-linkedin-in"></i>
                </Link>
                <Link href="#">
                    <i className="fab fa-instagram"></i>
                </Link>
            </div>

            <button className="footer-button"> 
                <img className="footer-icon" src={arrow} alt="" /> 
            </button>
        </footer>
    )
}

export default Footer