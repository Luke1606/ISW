// import { useMemo } from "react"
// import * as Yup from "yup"
// import useGenericForm from "../../../hooks/common/useGenericForm"
// import Modal from "../../common/Modal"

export const RequestForm = ({closeModal, prevValues, handleSubmit}) => {
    return (
        <>
            <label className="form-label" htmlFor="usuario"> Nombre del estudiante: </label>
            <input className="form-input" id="usuario" type="text"  value={prevValues.nombre} readOnly/>

            <label className="form-label" htmlFor="cargo-select"> Seleccione el ejercicio deseado: </label>
            <select id="cargo-select">
                <option disabled value=""> -- Escoja una opción -- </option>
                <option value="estudiante">  </option>
                <option value="profesor">  </option>
                <option value="dptoInformatica"> </option>
                <option value="secretaria">  </option>
                <option value="decano">  </option>
            </select>
        </>)
}

export const ReadOnlyRequestForm = (prevValues) => {

}
