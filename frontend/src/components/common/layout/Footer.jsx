import arrow from "../../../assets/arrow.gif"

const Footer = () => {
    return (
        <footer className="footer">
            <small>
                Universidad de las Ciencias Informáticas. XAUCE. Akademos © 2011-2020
            </small>
            <button className="footer-button"> 
                <img className="footer-icon" src={arrow} alt="" /> 
            </button>
        </footer>
    )
}

export default Footer