import { useNavigate } from "react-router-dom"
const HomeComponent = () => {
    const navigate = useNavigate()
    return (
        <>
            <h1>
                home
            </h1>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem, expedita cupiditate doloribus tenetur ab quo minima blanditiis soluta doloremque cumque provident tempore ex, rerum distinctio itaque corporis, reprehenderit eos totam!
            </p>
            <button onClick={() => {navigate("/login")}}>
                Acceder
            </button>
        </>
    )
}

export default HomeComponent