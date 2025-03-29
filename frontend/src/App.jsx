import { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "./routes"
import ToastNotification from "./components/common/ToastNotification"
import { AuthProvider } from "./contexts/AuthContext"
import useUserActivity from './hooks/Auth/useUserActivity'

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

            <AuthProvider>
                <Suspense fallback={<span className="spin"/>}>
                    <RouterProvider router={router} />
                </Suspense>
            </AuthProvider>
        </>
    )
}

export default App
