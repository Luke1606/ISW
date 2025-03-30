import { useMemo } from "react"
import * as Yup from "yup"
import useGenericForm from "../../../hooks/common/useGenericForm"
import Modal from "../../common/Modal"

const DefenseActForm = (params) => {
    return (
        <>
            <label className="form-label" htmlFor="nombre"> Nombre: </label>
            <input className="form-input" id="nombre" type="text"  value={prevValues.nombre || ""} />

            <label className="form-label" htmlFor="descripcion"> Descripción: </label>
            <input className="form-input" id="descripcion" type="textarea"  value={prevValues.descripcion} />

            <label className="form-label" htmlFor="adjunto"> Adjunto: </label>
            <input className="form-input" id="adjunto" type="file"  value={prevValues.adjunto} />
        </>
        )
}