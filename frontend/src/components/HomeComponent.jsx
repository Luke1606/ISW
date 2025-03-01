import { Link } from "react-router-dom"
const HomeComponent = () => {
    return (
        <>
            <h1>
                home
            </h1>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem, expedita cupiditate doloribus tenetur ab quo minima blanditiis soluta doloremque cumque provident tempore ex, rerum distinctio itaque corporis, reprehenderit eos totam!
            </p>
            <button>
                <Link to="/login">Acceder</Link>
            </button>
        </>
    )
}

export default HomeComponent