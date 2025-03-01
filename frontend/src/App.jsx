import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Layout from "./components/common/layout/Layout"
import HomeComponent from "./components/HomeComponent"
import LoginComponent from "./components/login/LoginComponent"
import { UserProvider } from "./contexts/UserContext"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import ListComponent from "./components/management/ListComponent"
import FormComponent from "./components/management/FormComponent"
import Error from "./components/common/Error"

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={ <Layout /> }>
                <Route index element={<HomeComponent />}/>
                
                <Route path="login" element={ <LoginComponent /> } />
                
                <Route element={ <ProtectedRoutesComponent /> }>      
                    <Route path="list" element={ <ListComponent /> } />
                    <Route path="form" element={ <FormComponent /> } />
                </Route>

                <Route path="*" element={ 
                    <Error 
                        errorTitle="Dirección no encontrada" 
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta." 
                    /> }
                />
            </Route> 
        )
    )

    return (
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
        )
}

export default App