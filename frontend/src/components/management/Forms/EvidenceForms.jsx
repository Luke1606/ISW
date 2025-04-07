// import { useMemo } from "react"
// import * as Yup from "yup"
// import useGenericForm from "../../../hooks/common/useGenericForm"
// import Modal from "../../common/Modal"
// import { useNavigate } from "react-router-dom"

export const EvidenceForm = ({values, functions}) => {
//     const initialValues = {
//         name: values.prevValues.name || "",
//         description: values.prevValues.description || "",
//         isUrl: values.isUrl,

//     }

//     const validationSchema = useMemo(() => Yup.object().shape({
//         name: Yup.string()
//             .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
//             .required("El nombre de usuario es obligatorio")
//             .matches(/[\W_]/, "El nombre no puede contener caracteres especiales"),
//         description: Yup.string()
//     }), [])

//     const { formik, formState } = useGenericForm(functions.handleSubmit, initialValues, validationSchema)

//     return (
//         <>
//         <form className="manage-form" onSubmit={formik.onSubmit}>      
//             <label className="form-label" 
//                 htmlFor="name">
//                     Nombre:
//             </label>

//             <input 
//                 className="form-input"
//                 id="name"
//                 type="text"
//                 placeholder="Ingrese el nombre"
//                 {...formik.getFieldProps("name")}
//                 />
            
//             <span
//                 className="error"
//                 style={formik.errors.name ? {} : { visibility: "hidden" }}
//                 >
//                 {formik.errors.name}
//             </span>

//             <label 
//                 className="form-label"
//                 htmlFor="description">
//                     Descripción:
//             </label>
            
//             <input 
//                 className="form-input" 
//                 id="description" 
//                 type="textarea"  
//                 placeholder="Ingrese una descripcion" 
//                 {...formik.getFieldProps("description")}
//                 />
            
//             <label htmlFor="isURL">¿Es URL?</label>
            
//             <input
//                 type="radio"
//                 id="isURL"
//                 name="isURL"
//                 value="true"
//                 checked={formik.values.isURL}
//                 onChange={() => formik.setFieldValue("isURL", true)}
//                 />
            
//             <label htmlFor="isFile">¿Es archivo?</label>
            
//             <input
//                 type="radio"
//                 id="isFile"
//                 name="isURL"
//                 value="false"
//                 checked={!formik.values.isURL}
//                 onChange={() => formik.setFieldValue("isURL", false)}
//                 />
            
//             { formik.values.isURL != null &&
//                 formik.values.isURL?
//                     <>
//                         <label htmlFor="url">URL</label>
//                         <input
//                             type="url"
//                             id="url"
//                             name="url"
//                             value={formik.values.url || ''}
//                             onChange={formik.handleChange}
//                             />
//                     </>
//                     :
//                     <>
//                         <label htmlFor="file">Archivo</label>
//                         <input
//                             type="file"
//                             id="file"
//                             name="file"
//                             onChange={(event) =>
//                                 formik.setFieldValue('file', event.currentTarget.files[0])
//                             }
//                             />
//                     </>}

//             { values.prevValues.isURL != undefined && 
//                 <label 
//                     className="form-label" 
//                     htmlFor="adjunto"
//                     > 
//                     Adjunto: 
//                 </label> }
//             { values.prevValues.isURL?
//                 <input 
//                     className="form-input" 
//                     id="adjunto" 
//                     type="url" 
//                     value={values.prevValues.adjunto} 
//                     placeholder="Ingrese la URL del adjunto" 
//                     /> 
//                 :
//                 <input 
//                     className="form-input" 
//                     id="adjunto" 
//                     type="file" 
//                     value={values.prevValues.adjunto} /> }
            
//             <button
//                 type="submit"
//                 className="accept-button"
//                 title="Aceptar"
//                 onClick={params.toggleVisible}
//                 data-popup-id={params.popupId}
//                 ref={params.openerRef}
//                 disabled={
//                     formState.pending || Object.keys(formik.errors).length > 0
//                 }
//                 style={
//                     formState.pending || Object.keys(formik.errors).length > 0
//                         ? { backgroundColor: "gray" }
//                         : {}
//                 }
//                 >
//                 Aceptar
//             </button>
//             <button className="cancel-button" onClick={params.goBack}>Cancelar</button>
//         </form>
//         <Modal
//             isOpen={isVisible}
//             >
//             <div 
//                 className=""
//                 data-popup-id={popupId}
//                 ref={dropPopupRef}
//                 >
//                 <p
//                     className="modal-content"
//                     >
//                     {formState.message}
//                 </p>
//             </div>
//         </Modal>
//         </>)
}

export const ReadOnlyEvidenceForm = ({prevValues}) => {
//     const navigate = useNavigate()
//     return (
//         <>
//             <input 
//             className="form-input"
//             id="name"
//             type="text"
//             readOnly
//             /> 

//             <input 
//                 className="form-input" 
//                 id="description"
//                 type="textarea"  
//                 value={prevValues.descripcion} 
//                 readOnly
//                 />

//             { params.prevValues.isURL? 
//                 <input
//                     className="form-input" 
//                     id="adjunto" 
//                     type="url" 
//                     placeholder="Ingrese la URL del adjunto" 
//                     value={params.prevValues.adjunto}
//                     />
//                 :
//                 <input 
//                     className="form-input" 
//                     id="adjunto" 
//                     type="file" 
//                     value={params.prevValues.adjunto} 
//                     /> }

//             <button
//                 className="accept-button"
//                 title="Aceptar"
//                 onClick={()=>navigate(-1)}
//                 disabled={!prevValues}
//                 style={!prevValues? { backgroundColor: "gray" } : {}
//                 }
//                 >
//                 Aceptar
//             </button>
//         </>
//     )
}