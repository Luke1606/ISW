import { useMemo } from "react";
import * as Yup from "yup";
import useGenericForm from "../../../hooks/common/useGenericForm";
import Modal from "../../common/Modal";

export const DefenseTribunalForm = ({ values = {}, functions = {} }) => {
    const prevValues = values.prevValues || {};

    const initialValues = {
        date: prevValues.date || "",
        president: prevValues.president || "",
        secretary: prevValues.secretary || "",
        vocal: prevValues.vocal || "",
        substitute: prevValues.substitute || ""
    };

    const validationSchema = useMemo(() => Yup.object().shape({
        date: Yup.date()
            .required('La fecha es obligatoria')
            .min(new Date(), 'La fecha no puede ser en el pasado'),
        
        president: Yup.string()
            .required('El presidente es requerido'),
            
        secretary: Yup.string()
            .required('El secretario es requerido'),
            
        vocal: Yup.string()
            .required('El vocal es requerido'),
            
        substitute: Yup.string()
            .required('El suplente es requerido')
    }), []);

    const { formik, formState } = useGenericForm(
        functions.handleSubmit || (() => {}),
        initialValues,
        validationSchema
    );

    return (
        <form
            className='form-container manage-form'
            onSubmit={formik.handleSubmit}
        >
            <label className="form-label" htmlFor="date">
                Fecha de defensa:
            </label>
            
            <input
                className="form-input"
                id="date"
                type="date"
                {...formik.getFieldProps('date')}
            />
            
            <span
                className="error"
                style={formik.errors.date && formik.touched.date ? {} : { visibility: "hidden" }}
            >
                {formik.errors.date}
            </span>

            <label className="form-label" htmlFor="president">
                Presidente del tribunal:
            </label>
            
            <input
                className="form-input"
                id="president"
                type="text"
                placeholder="Nombre del presidente"
                {...formik.getFieldProps('president')}
            />
            
            <span
                className="error"
                style={formik.errors.president && formik.touched.president ? {} : { visibility: "hidden" }}
            >
                {formik.errors.president}
            </span>

            <label className="form-label" htmlFor="secretary">
                Secretario del tribunal:
            </label>
            
            <input
                className="form-input"
                id="secretary"
                type="text"
                placeholder="Nombre del secretario"
                {...formik.getFieldProps('secretary')}
            />
            
            <span
                className="error"
                style={formik.errors.secretary && formik.touched.secretary ? {} : { visibility: "hidden" }}
            >
                {formik.errors.secretary}
            </span>

            <label className="form-label" htmlFor="vocal">
                Vocal del tribunal:
            </label>
            
            <input
                className="form-input"
                id="vocal"
                type="text"
                placeholder="Nombre del vocal"
                {...formik.getFieldProps('vocal')}
            />
            
            <span
                className="error"
                style={formik.errors.vocal && formik.touched.vocal ? {} : { visibility: "hidden" }}
            >
                {formik.errors.vocal}
            </span>

            <label className="form-label" htmlFor="substitute">
                Suplente del tribunal:
            </label>
            
            <input
                className="form-input"
                id="substitute"
                type="text"
                placeholder="Nombre del suplente"
                {...formik.getFieldProps('substitute')}
            />
            
            <span
                className="error"
                style={formik.errors.substitute && formik.touched.substitute ? {} : { visibility: "hidden" }}
            >
                {formik.errors.substitute}
            </span>

            <div className="button-container">
                <button
                    className='accept-button'
                    type='submit'
                    disabled={formState.pending || !formik.isValid}
                >
                    {formState.pending ? 'Guardando...' : 'Aceptar'}
                </button>

                <button
                    className='cancel-button'
                    type='button'
                    onClick={functions.goBack || (() => {})}
                >
                    Cancelar
                </button>
            </div>

            <Modal isOpen={functions.isVisible}>
                <div className="modal-content">
                    <p>{formState.message}</p>
                    <button
                        className="modal-close-button"
                        onClick={functions.toggleVisible}
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>
        </form>
    );
};

export const ReadOnlyDefenseTribunalForm = ({ prevValues = {} }) => {
    return (
        <form
            className='form-container manage-form'
            onSubmit={() => null}
        >
            <label className="form-label">
                Fecha de defensa:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.date || ""}
                readOnly
            />

            <label className="form-label">
                Presidente del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.president || ""}
                readOnly
            />

            <label className="form-label">
                Secretario del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.secretary || ""}
                readOnly
            />

            <label className="form-label">
                Vocal del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.vocal || ""}
                readOnly
            />

            <label className="form-label">
                Suplente del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.substitute || ""}
                readOnly
            />

            <button
                className='accept-button'
                type='button'
                onClick={() => window.history.back()}
            >
                Volver
            </button>
        </form>
    );
};

export const TribunalApprovalForm = ({ values = {}, functions = {} }) => {
    const prevValues = values.prevValues || {};

    const initialValues = {
        studentName: prevValues.studentName || "",
        thesisTitle: prevValues.thesisTitle || "",
        defenseDate: prevValues.defenseDate || "",
        tribunalMembers: prevValues.tribunalMembers || "",
        approvalStatus: prevValues.approvalStatus || ""
    };

    const { formik } = useGenericForm(
        functions.handleSubmit || (() => {}),
        initialValues,
        Yup.object().shape({})
    );

    return (
        <form
            className='form-container manage-form'
            onSubmit={formik.handleSubmit}
        >
            <label className="form-label">
                Nombre del estudiante:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.studentName || ""}
                readOnly
            />

            <label className="form-label">
                Título de la tesis:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.thesisTitle || ""}
                readOnly
            />

            <label className="form-label">
                Fecha de defensa:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.defenseDate || ""}
                readOnly
            />

            <label className="form-label">
                Miembros del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.tribunalMembers || ""}
                readOnly
            />

            <label className="form-label">
                Decisión del tribunal:
            </label>
            <div className="radio-group">
                <label className="radio-label">
                    <input
                        type="radio"
                        name="approvalStatus"
                        value="approved"
                        checked={formik.values.approvalStatus === "approved"}
                        onChange={() => formik.setFieldValue('approvalStatus', 'approved')}
                    />
                    <span>Aprobado</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        name="approvalStatus"
                        value="rejected"
                        checked={formik.values.approvalStatus === "rejected"}
                        onChange={() => formik.setFieldValue('approvalStatus', 'rejected')}
                    />
                    <span>Rechazado</span>
                </label>
            </div>

            <div className="button-container">
                <button
                    className='accept-button'
                    type='submit'
                >
                    Enviar decisión
                </button>
            </div>
        </form>
    );
};