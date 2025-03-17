import { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "./routes"
import { AuthProvider } from "./contexts/AuthContext"

const router = createBrowserRouter(routes, {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    },
})

const App = () => {
    return (
        <AuthProvider>
            <Suspense fallback={<span className="spin"/>}>
                <RouterProvider router={router} />
            </Suspense>
        </AuthProvider>
    )
}

export default App
