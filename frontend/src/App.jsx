import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Login from "./apps/login/pages/LoginPage"
import { AuthProvider } from "./apps/login/components/contexts/AuthProvider"
import TreePage from "./apps/management/pages/TreePage"
import FormPage from "./apps/management/pages/FormPage"
import NotFoundPage from "./apps/management/pages/NotFoundPage"
import Layout from "./apps/management/components/layout/Layout"
import ProtectedRoutes from "./apps/login/components/"


const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={ <Login /> } />
                
                <Route index element={ <ProtectedRoutes /> }>      
                    <Route element={ <Layout /> }>
                        <Route path="tree" element={ <TreePage /> } />
                        <Route path="form" element={ <FormPage /> } />
                    </Route>
                </Route>
                <Route path="*" element={ <NotFoundPage /> } />
            </>
        )
    )

    return (
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            )
}

export default App