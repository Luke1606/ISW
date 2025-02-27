import { Outlet } from "react-router-dom"
import bg from "../assets/background.jpg"
import Header from "./Header"
import Footer from "./Footer"

const styles = {
    container: {
        width : "100%",
        height : "100%",
        background : `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)), url(${bg})`,
        backgroundSize : "cover",
        backgroundPosition: 'center',
        position: 'fixed',
        margin : "0",
        padding : "0",
        right : "0",
        left : "0",
        top : "0",
        bottom : "0",
    }
}

const Layout = () => {
    return (
            <div style={styles.container}>
                <Header />
                    <main>
                            <Outlet />
                    </main> 
                <Footer />
            </div>
            )
}

export default Layout