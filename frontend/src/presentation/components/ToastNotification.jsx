import { ToastContainer } from "react-toastify"

const ToastNotification = () => 
    <ToastContainer
        position="top-center"
        theme= "colored"
        autoClose={7000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        newestOnTop={true}
        draggable={false}
    />

export default ToastNotification