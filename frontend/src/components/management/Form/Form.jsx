import { useNavigate, useParams } from "react"
import { useFormik} from "formik"
import { createData, updateData, getData } from "../../../API"
import { AcceptButton, CancelButton } from "../../general_components/Buttons"
import datatypes from "../../general_components/Datatypes"

const DataForm = () => {
    const { dataType, }= useParams()
    const { idData } = useParams() || undefined
    const { readOnly } = useParams() || false
    
    const navigate = useNavigate()
    
    const goBack = (e) => {
        e.preventDefault()
        if (idData) 
            navigate(`/tree/${dataType}/${idData}`)
        else
            navigate(`/tree/${dataType}`)
    }
    
    const { onSubmit } = useParams() || undefined

    const onSubmitForm = (e) => {
        if (readOnly) {
            goBack()
            return
        }

        const form = Array.from(new FormData(e.target))
        const data = Object.fromEntries(form)

        if (idData === 0)
            createData(dataType, data)
        else
            updateData(dataType, data)

        if(onSubmit) onSubmit()
    }

    let children

    const formik = useFormik({
        onSubmit: onSubmitForm,
    })

    switch (dataType) {
        case datatypes.evidence:
            children = <EvidenceForm idData={idData} formik={formik} readOnly={readOnly}/>
            break 
        case datatypes.request:
            children = <RequestForm idData={idData} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.defense_tribunal:    
            children = <DefenseTribunalForm idData={idData} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.tribunal:
            children = <TribunalAprovalForm idData={idData} formik={formik}/>
            break
        case datatypes.defense_act:    
            children = <DefenseActForm idData={idData} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.professor || datatypes.student:    
            children = <UserForm idData={idData} formik={formik} readOnly={readOnly}/>
            break
    }
    return (
        <div style={styles.formContainer}>
            <form onSubmit={onSubmitForm}>
                {children}
                <AcceptButton/>
                {!readOnly && <CancelButton onClick={goBack}/>}
            </form>
        </div>
    )
}

export { DataForm }

const EvidenceForm = (idData=0, readOnly, formik) => {
    let prevValues = {}
    if (idData != 0) prevValues = fetchPrevValues(idData)

    const initialValues = {
        nombre: prevValues.nombre,
        descripcion: prevValues.descripcion,
    }

    const validate = (values) => {
        const errors = {}
        
        if (!values.nombre)
            errors.nombre = "Requerido"
        if (!values.descripcion)
            errors.descripcion = ""
        return errors
    }
    
    formik.append(initialValues)
    formik.append(validate)

    return (
        <>
            <label style={styles.label} 
                htmlFor="name">
                    Nombre:
            </label>

            { readOnly && 
                <input style={styles.input}
                id="name"
                name="nombre"
                type="text"
                readOnly
                /> }

            { !readOnly && 
                <input style={styles.input}
                id="name"
                name="nombre"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
                placeholder="Ingrese el nombre"/> }
            
            { !readOnly && formik.errors.nombre && <span>{formik.errors.nombre}</span>}

            <label style={styles.label} 
                htmlFor="descripcion">
                    Descripción:
            </label>
            { readOnly && <input style={styles.input} id="descripcion" type="textarea"  value={prevValues.descripcion} readOnly/> }
            { !readOnly && <input style={styles.input} id="descripcion" type="textarea"  value={prevValues.descripcion || ""} placeholder="Ingrese una descripcion" /> }
            
            { !readOnly && <label style={styles.label} htmlFor="url-file">URL</label>}
            { !readOnly && prevValues.checked && <input style={styles.input} id="url-file" type="radio" onClick={prevValues.isURL = true}  checked /> }
            { !readOnly && !prevValues.checked && <input style={styles.input} id="url-file" type="radio" onClick={prevValues.isURL = true} /> }
            
            { prevValues.isURL != undefined && <label style={styles.label} htmlFor="adjunto"> Adjunto: </label> }
            { prevValues.isURL && readOnly && <input style={styles.input} id="adjunto" type="url" value={prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
            { prevValues.isURL && !readOnly && <input style={styles.input} id="adjunto" type="url" value={prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
            
            { !prevValues.isURL && readOnly && <input style={styles.input} id="adjunto" type="file" value={prevValues.adjunto} /> }
            { !prevValues.isURL && !readOnly && <input style={styles.input} id="adjunto" type="file" value={prevValues.adjunto} /> }
        </>)
}

// eslint-disable-next-line no-unused-vars
const RequestForm = (idData=0, formik, readOnly) => {
    let prevValues = {}
    if (idData != 0) prevValues = fetchPrevValues(idData)

    return (
        <>
            <label style={styles.label} htmlFor="usuario"> Nombre del estudiante: </label>
            <input style={styles.input} id="usuario" type="text"  value={prevValues.nombre} />

            <label style={styles.label} htmlFor="cargo-select"> Seleccione el ejercicio deseado: </label>
            <select id="cargo-select">
                <option value=""> -- Escoja una opción -- </option>
                <option value="estudiante">  </option>
                <option value="profesor">  </option>
                <option value="dptoInformatica"> </option>
                <option value="secretaria">  </option>
                <option value="decano">  </option>
            </select>
        </>)
}

// eslint-disable-next-line no-unused-vars
const DefenseTribunalForm = (idData=0, formik, readOnly) => {
    let prevValues = {}
    if (idData != 0) prevValues = fetchPrevValues(idData)

    return (
        <>
            <label style={styles.label} htmlFor="">Seleccione una fecha:</label>
            <input style={styles.input} type="date" value={prevValues.date || ""} />

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" />

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" />

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" />

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" />
        </>)
}

// eslint-disable-next-line no-unused-vars
const TribunalAprovalForm = (idData, formik, readOnly) => {
    let prevValues = fetchPrevValues(idData)

    return (
        <>
            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" value={prevValues} readOnly/>

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" value={prevValues} readOnly/>

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" value={prevValues} readOnly/>

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="text" value={prevValues} readOnly/>

            <label style={styles.label} htmlFor=""></label>
            <input style={styles.input} type="radio" />
            <input style={styles.input} type="radio" />
        </>)
}

// eslint-disable-next-line no-unused-vars
const DefenseActForm = (idData=0, formik, readOnly) => {
    let prevValues = {}
    if (idData != 0) prevValues = fetchPrevValues(idData)

    return (
        <>
            <label style={styles.label} htmlFor="nombre"> Nombre: </label>
            <input style={styles.input} id="nombre" type="text"  value={prevValues.nombre || ""} />

            <label style={styles.label} htmlFor="descripcion"> Descripción: </label>
            <input style={styles.input} id="descripcion" type="textarea"  value={prevValues.descripcion} />

            <label style={styles.label} htmlFor="adjunto"> Adjunto: </label>
            <input style={styles.input} id="adjunto" type="file"  value={prevValues.adjunto} />
        </>
        )
}

// eslint-disable-next-line no-unused-vars
const UserForm = (idData=0, formik, readOnly) => {
    let prevValues = {}
    if (idData != 0) prevValues = fetchPrevValues(idData)

    return (
        <>
            <label style={styles.label} htmlFor="usuario"> Nombre de usuario: </label>
            <input style={styles.input} id="usuario" type="text"  value={prevValues.usuario} />

            <label style={styles.label} htmlFor="password"> Contraseña: </label>
            <input style={styles.input} id="password" type="password"  value={prevValues.password} />
        
            <label style={styles.label} htmlFor="cargo-select"> Seleccione el cargo: </label>
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

const fetchPrevValues = async (id, dataType) => {
    const response = await getData(`/${dataType}/${id}`)
    
    if (response) 
        return response.data
    
    return null
}

// const ReportForm = ()=>{
//     const { onSubmit } = useParams()
//     return (
//         <form onSubmit={onSubmit}>


//         </form>
//     )
// }

const styles = {
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Altura completa de la ventana
        background: 'linear-gradient(to bottom, rgb(235, 157, 41), darkorange)', // Fondo con gradiente
    },
    default: {
        backgroundColor: 'rgb(230, 230, 230)', // Fondo blanco del formulario
        borderRadius: '10px', // Bordes redondeados
        padding: '40px', // Espaciado interno
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra para el formulario
        width: '400px', // Ancho del formulario
    },
    input : {
        width: '100%', // Ancho completo
        padding: '10px', // Espaciado interno
        margin: '10px 0', // Margen entre inputs
        borderRadius: '10px', // Bordes redondeados
        border: '1px solid #ccc', // Borde gris claro
    },
    label: {
        fontSize : '24px',
        marginBottom: '5px', // Margen inferior para las etiquetas
        display: 'block', // Mostrar etiquetas como bloques
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end', // Espacio entre botones
        marginTop: '20px', // Margen superior para los botones
    },
}
