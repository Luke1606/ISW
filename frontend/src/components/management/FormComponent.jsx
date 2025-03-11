// import { useMemo } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import * as Yup from "yup"
// import datatypes from "../../js-files/Datatypes"
// import useGenericForm from "../../hooks/useGenericForm"
// import { useForm } from "../../hooks/useManagement"
// import { updateData, createData } from "../../services/ManagementService"
// import Modal from "../common/Modal"

const FormComponent = () => {
//     const { dataType, idData, readOnly }= useParams()
//     const { prevValues } = useForm(dataType, idData) 
    
//     const navigate = useNavigate()

//     const goBack = () => {
//         if (idData) 
//             navigate(`/list/${dataType}/${idData}`)
//         else
//             navigate(`/list/${dataType}`)
//     }

//     const handleSubmit = readOnly? 
//                             goBack 
//                             : 
//                             idData? 
//                                 updateData 
//                                 : 
//                                 createData    
    
//     const params = {dataType, idData, readOnly, prevValues, handleSubmit, goBack}

//     let children

//     switch (dataType) {
//         case datatypes.evidence:
//             children = <EvidenceForm params = {params}/>
//             break 
//         case datatypes.request:
//             children = <RequestForm params = {params}/>
//             break
//         case datatypes.defense_tribunal:    
//             children = <DefenseTribunalForm params = {params}/>
//             break
//         case datatypes.tribunal:
//             children = <TribunalAprovalForm params = {params}/>
//             break
//         case datatypes.defense_act:    
//             children = <DefenseActForm params = {params}/>
//             break
//         case datatypes.professor || datatypes.student:    
//             children = <UserForm params = {params}/>
//             break
//     }
//     return (
//         <div className="manage-container">
//             {children}
//         </div>
//     )
}

export default FormComponent

// const EvidenceForm = (params) => {
    
//     const initialValues = {
//         nombre: params.prevValues.nombre || "",
//         descripcion: params.prevValues.descripcion || "",
//     }

//     const validationSchema = useMemo(() => Yup.object().shape({
//         name: Yup.string()
//             .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
//             .required("El nombre de usuario es obligatorio")
//             .matches(/[\W_]/, "El nombre no puede contener caracteres especiales"),
//         description: Yup.string()
//     }), [])

//     const { formik, formState, isResponseModalOpen, setResponseModalOpen } = useGenericForm(params.handleSubmit, initialValues, validationSchema)

//     return (
//         <>
//         <form className="manage-form" onSubmit={formik.onSubmit}>      
//             {formik.errors.general && 
//                 <span 
//                     className="error">
//                         {formik.errors.general}
//                 </span>}
                
//                 <button className="accept-button">Aceptar</button>
//                 {!params.readOnly && <button className="cancel-button" onClick={params.goBack}>Cancelar</button>}
//             <label className="form-label" 
//                 htmlFor="name">
//                     Nombre:
//             </label>

//             { params.readOnly && 
//                 <input 
//                     className="form-input"
//                     id="name"
//                     name="nombre"
//                     type="text"
//                     readOnly
//                     /> }

//             { !params.readOnly && 
//                 <input 
//                     className="form-input"
//                     id="name"
//                     name="nombre"
//                     type="text"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.nombre}
//                     placeholder="Ingrese el nombre"
//                     /> }
            
//             { !params.readOnly && formik.errors.nombre && <span>{formik.errors.nombre}</span>}

//             <label 
//                 className="form-label"
//                 htmlFor="description">
//                     Descripción:
//             </label>
//             { params.readOnly && <input className="form-input" id="description" type="textarea"  value={params.prevValues.descripcion} readOnly/> }
//             { !params.readOnly && <input className="form-input" id="description" type="textarea"  value={params.prevValues.descripcion || ""} placeholder="Ingrese una descripcion" /> }
            
//             { !params.readOnly && <label className="form-label" htmlFor="url-file">URL</label>}
//             { !params.readOnly && params.prevValues.checked && <input className="form-input" id="url-file" type="radio" onClick={params.prevValues.isURL = true}  checked /> }
//             { !params.readOnly && !params.prevValues.checked && <input className="form-input" id="url-file" type="radio" onClick={params.prevValues.isURL = true} /> }
            
//             { params.prevValues.isURL != undefined && <label className="form-label" htmlFor="adjunto"> Adjunto: </label> }
//             { params.prevValues.isURL && params.readOnly && <input className="form-input" id="adjunto" type="url" value={params.prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
//             { params.prevValues.isURL && !params.readOnly && <input className="form-input" id="adjunto" type="url" value={params.prevValues.adjunto} placeholder="Ingrese la URL del adjunto" /> }
            
//             { !params.prevValues.isURL && params.readOnly && <input className="form-input" id="adjunto" type="file" value={params.prevValues.adjunto} /> }
//             { !params.prevValues.isURL && !params.readOnly && <input className="form-input" id="adjunto" type="file" value={params.prevValues.adjunto} /> }
//         </form>
//             <Modal 
//                 isOpen={isResponseModalOpen}
//                 title={formState.pending? "Cargando..." : formState.success? "Autenticación exitosa" : "Error de autenticación" }
//                 >
//                     <p>
//                         {formState.success? formState.message : formik.errors.general}
//                     </p>
                    
//                     <button 
//                         className="button"
//                         onClick={() => setResponseModalOpen(false)}
//                         >
//                         Cerrar
//                     </button>
//             </Modal>
//         </>)
// }

// // eslint-disable-next-line no-unused-vars
// const RequestForm = (params) => {
//     return (
//         <>
//             <label className="form-label" htmlFor="usuario"> Nombre del estudiante: </label>
//             <input className="form-input" id="usuario" type="text"  value={prevValues.nombre} />

//             <label className="form-label" htmlFor="cargo-select"> Seleccione el ejercicio deseado: </label>
//             <select id="cargo-select">
//                 <option disabled value=""> -- Escoja una opción -- </option>
//                 <option value="estudiante">  </option>
//                 <option value="profesor">  </option>
//                 <option value="dptoInformatica"> </option>
//                 <option value="secretaria">  </option>
//                 <option value="decano">  </option>
//             </select>
//         </>)
// }

// // eslint-disable-next-line no-unused-vars
// const DefenseTribunalForm = (params) => {

//     return (
//         <>
//             <label className="form-label" htmlFor="">Seleccione una fecha:</label>
//             <input className="form-input" type="date" value={prevValues.date || ""} />

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" />

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" />

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" />

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" />
//         </>)
// }

// // eslint-disable-next-line no-unused-vars
// const TribunalAprovalForm = (params) => {

//     return (
//         <>
//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" value={prevValues} readOnly/>

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" value={prevValues} readOnly/>

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" value={prevValues} readOnly/>

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="text" value={prevValues} readOnly/>

//             <label className="form-label" htmlFor=""></label>
//             <input className="form-input" type="radio" />
//             <input className="form-input" type="radio" />
//         </>
//         )
// }

// // eslint-disable-next-line no-unused-vars
// const DefenseActForm = (params) => {
//     return (
//         <>
//             <label className="form-label" htmlFor="nombre"> Nombre: </label>
//             <input className="form-input" id="nombre" type="text"  value={prevValues.nombre || ""} />

//             <label className="form-label" htmlFor="descripcion"> Descripción: </label>
//             <input className="form-input" id="descripcion" type="textarea"  value={prevValues.descripcion} />

//             <label className="form-label" htmlFor="adjunto"> Adjunto: </label>
//             <input className="form-input" id="adjunto" type="file"  value={prevValues.adjunto} />
//         </>
//         )
// }

// // eslint-disable-next-line no-unused-vars
// const UserForm = (params) => {
//     return (
//         <>
//             <label className="form-label" htmlFor="usuario"> Nombre de usuario: </label>
//             <input className="form-input" id="usuario" type="text"  value={prevValues.usuario} />

//             <label className="form-label" htmlFor="password"> Contraseña: </label>
//             <input className="form-input" id="password" type="password"  value={prevValues.password} />
        
//             <label className="form-label" htmlFor="cargo-select"> Seleccione el cargo: </label>
//             <select id="cargo-select">
//                 <option value=""> -- Escoja una opción -- </option>
//                 <option value="estudiante"> Estudiante </option>
//                 <option value="profesor"> Profesor </option>
//                 <option value="dptoInformatica"> Profesor miembro del Departamento de Informática </option>
//                 <option value="decano"> Miembro del Decanato </option>
//             </select>
//         </>
//         )
// }