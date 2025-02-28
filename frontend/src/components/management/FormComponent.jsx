import { useParams, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { datatypes } from "../../js-files/Datatypes"
import { useForm } from "../../hooks/useManagement"

const FormComponent = () => {
    const { dataType, }= useParams()
    const { idData, onSubmit } = useParams() || undefined
    const { readOnly } = useParams() || false
    const { prevValues } = useForm(dataType, idData) || undefined
    const formik = useFormik({
            onSubmit: onSubmit,
        })
    
    const navigate = useNavigate()

    const goBack = (e) => {
        e.preventDefault()
        if (idData) 
            navigate(`/list/${dataType}/${idData}`)
        else
            navigate(`/list/${dataType}`)
    }

    let children

    switch (dataType) {
        case datatypes.evidence:
            children = <EvidenceForm prevValues={prevValues} formik={formik} readOnly={readOnly}/>
            break 
        case datatypes.request:
            children = <RequestForm prevValues={prevValues} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.defense_tribunal:    
            children = <DefenseTribunalForm prevValues={prevValues} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.tribunal:
            children = <TribunalAprovalForm prevValues={prevValues} formik={formik}/>
            break
        case datatypes.defense_act:    
            children = <DefenseActForm prevValues={prevValues} formik={formik} readOnly={readOnly}/>
            break
        case datatypes.professor || datatypes.student:    
            children = <UserForm prevValues={prevValues} formik={formik} readOnly={readOnly}/>
            break
    }
    return (
        <div className="manage-container">
            <form className="manage-form" onSubmit={onSubmit}>
                {children}
                <button className="accept-button">Aceptar</button>
                {!readOnly && <button className="cancel-button" onClick={goBack}>Cancelar</button>}
            </form>
        </div>
    )
}

export default FormComponent

const EvidenceForm = (prevValues, readOnly, formik) => {
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
            <label className="form-label" 
                htmlFor="name">
                    Nombre:
            </label>

            { readOnly && 
                <input className="form-input"
                id="name"
                name="nombre"
                type="text"
                readOnly
                /> }

            { !readOnly && 
                <input className="form-input"
                id="name"
                name="nombre"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
                placeholder="Ingrese el nombre"/> }
            
            { !readOnly && formik.errors.nombre && <span>{formik.errors.nombre}</span>}

            <label className="form-label"
                htmlFor="descripcion">
                    Descripción:
            </label>
            { readOnly && <input className="form-input" id="descripcion" type="textarea"  value={prevValues.descripcion} readOnly/> }
            { !readOnly && <input className="form-input" id="descripcion" type="textarea"  value={prevValues.descripcion || ""} placeholder="Ingrese una descripcion" /> }
            
            { !readOnly && <label className="form-label" htmlFor="url-file">URL</label>}
            { !readOnly && prevValues.checked && <input className="form-input" id="url-file" type="radio" onClick={prevValues.isURL = true}  checked /> }
            { !readOnly && !prevValues.checked && <input className="form-input" id="url-file" type="radio" onClick={prevValues.isURL = true} /> }
            
            { prevValues.isURL != undefined && <label className="form-label" htmlFor="adjunto"> Adjunto: </label> }
            { prevValues.isURL && readOnly && <input className="form-input" id="adjunto" type="url" value={prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
            { prevValues.isURL && !readOnly && <input className="form-input" id="adjunto" type="url" value={prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
            
            { !prevValues.isURL && readOnly && <input className="form-input" id="adjunto" type="file" value={prevValues.adjunto} /> }
            { !prevValues.isURL && !readOnly && <input className="form-input" id="adjunto" type="file" value={prevValues.adjunto} /> }
        </>)
}

// eslint-disable-next-line no-unused-vars
const RequestForm = (prevValues, formik, readOnly) => {
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
    if (idData != 0) prevValues = getPrevValues(idData)

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
    let prevValues = getPrevValues(idData)

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
    if (idData != 0) prevValues = getPrevValues(idData)

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
    if (idData != 0) prevValues = getPrevValues(idData)

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