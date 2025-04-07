/* eslint-disable react/prop-types */
import { useMemo } from "react"
import * as Yup from "yup"
import useGenericForm from "../../../hooks/common/useGenericForm"
import datatypes from "../../../js-files/Datatypes"
import { useNavigate } from "react-router-dom"

export const UserForm = ({values, functions}) => {
    const prevValues = values.prevValues

    const initialValues = {
        name: values.prevValues.user.name || "",
        description: values.prevValues.user.description || "",
        isUrl: values.isUrl,

    }

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
            .required("El nombre de usuario es obligatorio")
            .matches(/[\W_]/, "El nombre no puede contener caracteres especiales"),
        description: Yup.string()
    }), [])

    // eslint-disable-next-line no-unused-vars
    const { formik, formState } = useGenericForm(functions.handleSubmit, initialValues, validationSchema)

    return (
        <>
            <label 
                className="form-label" 
                htmlFor="usuario"
                > 
                Nombre de usuario: 
            </label>
            
            <input 
                className="form-input" 
                id="usuario" 
                type="text"  
                value={prevValues.usuario} 
                />

            <label 
                className="form-label" 
                htmlFor="password"
                >
                Contraseña: 
            </label>

            <input 
                className="form-input" 
                id="password" 
                type="password"
                value={prevValues.password} 
                />
        
            <label 
                className="form-label" 
                htmlFor="cargo-select"
                > 
                Seleccione el cargo: 
            </label>

            <select id="cargo-select">
                <option value=""> -- Escoja una opción -- </option>
                <option value="estudiante"> Estudiante </option>
                <option value="profesor"> Profesor </option>
                <option value="dptoInformatica"> Profesor miembro del Departamento de Informática </option>
                <option value="decano"> Miembro del Decanato </option>
            </select>
        </>
        )
}

export const ReadOnlyUserForm = ({prevValues}) => {
    const navigate = useNavigate()
    if (!prevValues) return null

    return (
        <form
            className="form-container" 
            onSubmit={()=>navigate(-1)}
            >
            <label 
                className="form-label" 
                htmlFor="usuario"
                > 
                Nombre completo: 
            </label>
            
            <input 
                className="form-input" 
                id="usuario" 
                type="text"  
                value={prevValues.user.name} 
                readOnly
                />

            <label 
                className="form-label" 
                htmlFor="usuario"
                > 
                Nombre de usuario: 
            </label>
            
            <input 
                className="form-input" 
                id="usuario" 
                type="text"  
                value={prevValues.user.username} 
                readOnly
                />
            
            { prevValues.user.user_role === datatypes.user.student?
                <>
                    <label 
                        className="form-label" 
                        htmlFor="faculty"
                        > 
                        Facultad:
                    </label>

                    <input 
                        className="form-input" 
                        type="text" 
                        id="faculty" 
                        value={prevValues.faculty} 
                        readOnly/>

                    <label 
                        className="form-label" 
                        htmlFor="group"
                        > 
                        Grupo:
                    </label>

                    <input 
                        className="form-input" 
                        type="group" 
                        id="cargo"
                        value={prevValues.group} 
                        readOnly/>
                </>
                :
                <>
                    <label 
                        className="form-label" 
                        htmlFor="cargo"
                        > 
                        Cargo:
                    </label>

                    <input 
                        className="form-input" 
                        type="text" 
                        id="cargo" 
                        value={prevValues.role} 
                        readOnly/>
                </>}
                <button 
                    className="accept-button"
                    type="submit"
                    >
                    Aceptar
                </button>
        </form>
    )
}