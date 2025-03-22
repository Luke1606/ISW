import Layout from "./components/common/layout/Layout"
import HomeComponent from "./components/HomeComponent"
import LoginComponent from "./components/login/LoginComponent"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import ListComponent from "./components/management/ListComponent"
import FormComponent from "./components/management/FormComponent"
import Error from "./components/common/Error"

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomeComponent />,
      },
      {
        path: "login",
        element: <LoginComponent />,
      },
      {
        element: <ProtectedRoutesComponent />,
        children: [
          {
            path: "list/:datatype/:index?",
            element: <ListComponent />,
          },
          {
            path: "form/:datatype/:index?/:view?",
            element: <FormComponent />,
          },
          {
            path: "*",
            element: (
              <Error
                errorTitle="Dirección no encontrada"
                errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta."
              />
            ),
          },
        ],
      },
    ],
  },
];

export default routes
