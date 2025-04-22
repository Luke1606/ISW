import { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "./routes"
import ToastNotification from "./components/common/ToastNotification"
import { AuthProvider } from "./contexts/AuthContext"
import useUserActivity from './hooks/Auth/useUserActivity'
import { ModalProvider } from "./contexts/ModalContext"
import { LoadingProvider } from "./contexts/LoadingContext"

const router = createBrowserRouter(routes, {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    },
})

const App = () => {
    useUserActivity()
    
    return (
        <>
            <ToastNotification />

            <Suspense fallback={<span className="spinner"/>}>
                <AuthProvider>
                    <LoadingProvider>
                        <ModalProvider>
                            <RouterProvider router={router} />
                        </ModalProvider>
                    </LoadingProvider>
                </AuthProvider>
            </Suspense>
        </>
    )
}

export default App
