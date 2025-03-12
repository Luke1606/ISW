import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Layout from "./components/common/layout/Layout"
import HomeComponent from "./components/HomeComponent"
import LoginComponent from "./components/login/LoginComponent"
import { AuthProvider } from "./contexts/AuthContext"
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
                    <Route path="list/:datatype/:index" element={ <ListComponent /> } />
                  
                    <Route path="form/:datatype/:index/:view" element={ <FormComponent /> } />
                  
                    <Route path="*" element={ 
                    <Error 
                        errorTitle="Dirección no encontrada" 
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta." 
                    /> }
                />
                </Route>
            </Route> 
        )
    )

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
        )
}

export default App