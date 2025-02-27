import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import UserComponent from "./components/login/UserComponent"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import Layout from "./components/common/layout/Layout"
import Error from "./components/common/Error"
import { UserProvider } from "./contexts/UserContext"
import TreeComponent from "./components/management/TreeComponent"
import FormComponent from "./components/management/FormComponent"
import Home from "./components/Home"

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={ <UserComponent /> } />
                
                <Route element={ <ProtectedRoutesComponent /> }>      
                    <Route element={ <Layout /> }>
                        <Route index element={<Home />}/>
                        <Route path="tree" element={ <TreeComponent /> } />
                        <Route path="form" element={ <FormComponent /> } />
                    </Route>
                </Route>

                <Route path="*" element={ 
                    <Error 
                        errorTitle="Dirección no encontrada" 
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta." 
                        /> } 
                />
            </>
        )
    )

    return (
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
            )
}

export default App