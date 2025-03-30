import { useMemo } from "react"
import * as Yup from "yup"
import useGenericForm from "../../../hooks/common/useGenericForm"
import Modal from "../../common/Modal"

const DefenseTribunalForm = (params) => {

    return (
        <>
            <label className="form-label" htmlFor="">Seleccione una fecha:</label>
            <input className="form-input" type="date" value={prevValues.date || ""} />

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" />

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" />

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" />

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" />
        </>)
}

// eslint-disable-next-line no-unused-vars
const TribunalAprovalForm = (params) => {

    return (
        <>
            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" value={prevValues} readOnly/>

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" value={prevValues} readOnly/>

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" value={prevValues} readOnly/>

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="text" value={prevValues} readOnly/>

            <label className="form-label" htmlFor=""></label>
            <input className="form-input" type="radio" />
            <input className="form-input" type="radio" />
        </>
        )
}