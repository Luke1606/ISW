import { useMemo } from "react";
import * as Yup from "yup";
import useGenericForm from "../../../hooks/common/useGenericForm";
import Modal from "../../common/Modal";

export const RequestForm = ({ values = {}, functions = {} }) => {
    const prevValues = values.prevValues || {};
    const exerciseOptions = [
        { value: "estudiante", label: "Ejercicio para estudiantes" },
        { value: "profesor", label: "Ejercicio para profesores" },
        { value: "dptoInformatica", label: "Ejercicio para departamento de informática" },
        { value: "secretaria", label: "Ejercicio para secretaría" },
        { value: "decano", label: "Ejercicio para decanato" }
    ];

    const initialValues = {
        studentName: prevValues.nombre || "",
        selectedExercise: prevValues.ejercicio || "",
        additionalInfo: prevValues.infoAdicional || ""
    };

    const validationSchema = useMemo(() => Yup.object().shape({
        studentName: Yup.string()
            .required('El nombre del estudiante es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        
        selectedExercise: Yup.string()
            .required('Debe seleccionar un ejercicio'),
            
        additionalInfo: Yup.string()
            .max(500, 'La información adicional no puede exceder los 500 caracteres')
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
            <label className="form-label" htmlFor="studentName">
                Nombre del estudiante:
            </label>
            
            <input
                className="form-input"
                id="studentName"
                type="text"
                placeholder="Ingrese el nombre completo"
                {...formik.getFieldProps('studentName')}
            />
            
            <span
                className="error"
                style={formik.errors.studentName && formik.touched.studentName ? {} : { visibility: "hidden" }}
            >
                {formik.errors.studentName}
            </span>

            <label className="form-label" htmlFor="selectedExercise">
                Seleccione el ejercicio deseado:
            </label>
            
            <select
                className="form-select"
                id="selectedExercise"
                {...formik.getFieldProps('selectedExercise')}
            >
                <option value="" disabled>-- Escoja una opción --</option>
                {exerciseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            <span
                className="error"
                style={formik.errors.selectedExercise && formik.touched.selectedExercise ? {} : { visibility: "hidden" }}
            >
                {formik.errors.selectedExercise}
            </span>

            <label className="form-label" htmlFor="additionalInfo">
                Información adicional (opcional):
            </label>
            
            <textarea
                className="form-input"
                id="additionalInfo"
                rows="4"
                placeholder="Proporcione detalles adicionales sobre su solicitud..."
                {...formik.getFieldProps('additionalInfo')}
            />
            
            <span
                className="error"
                style={formik.errors.additionalInfo && formik.touched.additionalInfo ? {} : { visibility: "hidden" }}
            >
                {formik.errors.additionalInfo}
            </span>

            <div className="button-container">
                <button
                    className='accept-button'
                    type='submit'
                    disabled={formState.pending || !formik.isValid}
                >
                    {formState.pending ? 'Enviando...' : 'Enviar Solicitud'}
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

export const ReadOnlyRequestForm = ({ prevValues = {} }) => {
    const exerciseOptions = {
        estudiante: "Ejercicio para estudiantes",
        profesor: "Ejercicio para profesores",
        dptoInformatica: "Ejercicio para departamento de informática",
        secretaria: "Ejercicio para secretaría",
        decano: "Ejercicio para decanato"
    };

    return (
        <form
            className='form-container manage-form'
            onSubmit={() => null}
        >
            <label className="form-label">
                Nombre del estudiante:
            </label>
            <input
                className="form-input"
                type="text"
                value={prevValues.nombre || ""}
                readOnly
            />

            <label className="form-label">
                Ejercicio solicitado:
            </label>
            <input
                className="form-input"
                type="text"
                value={exerciseOptions[prevValues.ejercicio] || prevValues.ejercicio || ""}
                readOnly
            />

            {prevValues.infoAdicional && (
                <>
                    <label className="form-label">
                        Información adicional:
                    </label>
                    <textarea
                        className="form-input"
                        rows="4"
                        value={prevValues.infoAdicional}
                        readOnly
                    />
                </>
            )}

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