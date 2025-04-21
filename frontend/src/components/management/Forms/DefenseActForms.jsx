import { useMemo } from "react";
import * as Yup from "yup";
import useGenericForm from "../../../hooks/common/useGenericForm";
import Modal from "../../common/Modal";

export const DefenseActForm = ({ values = {}, functions = {} }) => {
    const prevValues = values.prevValues || {};

    const initialValues = {
        nombre: prevValues.nombre || "",
        descripcion: prevValues.descripcion || "",
        adjunto: prevValues.adjunto || null
    };

    const validationSchema = useMemo(() => Yup.object().shape({
        nombre: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio'),
        
        descripcion: Yup.string()
            .required('La descripción es obligatoria'),
            
        adjunto: Yup.mixed()
            .required('El archivo adjunto es requerido')
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
            <label className="form-label" htmlFor="nombre">
                Nombre del acta:
            </label>
            
            <input
                className="form-input"
                id="nombre"
                type="text"
                placeholder="Ej: Acta de defensa de tesis"
                {...formik.getFieldProps('nombre')}
            />
            
            <span
                className="error"
                style={formik.errors.nombre && formik.touched.nombre ? {} : { visibility: "hidden" }}
            >
                {formik.errors.nombre}
            </span>

            <label className="form-label" htmlFor="descripcion">
                Descripción:
            </label>
            
            <textarea
                className="form-input"
                id="descripcion"
                rows="4"
                placeholder="Describa el contenido del acta..."
                {...formik.getFieldProps('descripcion')}
            />
            
            <span
                className="error"
                style={formik.errors.descripcion && formik.touched.descripcion ? {} : { visibility: "hidden" }}
            >
                {formik.errors.descripcion}
            </span>

            <label className="form-label" htmlFor="adjunto">
                Documento adjunto:
            </label>
            
            <input
                className="form-input"
                id="adjunto"
                type="file"
                onChange={(event) => {
                    formik.setFieldValue('adjunto', event.currentTarget.files[0]);
                }}
            />
            
            <span
                className="error"
                style={formik.errors.adjunto && formik.touched.adjunto ? {} : { visibility: "hidden" }}
            >
                {formik.errors.adjunto}
            </span>

            {prevValues.adjunto && (
                <div className="current-attachment">
                    <p>Archivo actual: {prevValues.adjunto.name || "Documento cargado"}</p>
                </div>
            )}

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

export const ReadOnlyDefenseActForm = ({ prevValues = {} }) => {
    return (
        <form
            className='form-container manage-form'
            onSubmit={() => null}
        >
            <label className="form-label" htmlFor="nombre">
                Nombre del acta:
            </label>
            
            <input
                className="form-input"
                id="nombre"
                type="text"
                value={prevValues.nombre || ""}
                readOnly
            />

            <label className="form-label" htmlFor="descripcion">
                Descripción:
            </label>
            
            <textarea
                className="form-input"
                id="descripcion"
                rows="4"
                value={prevValues.descripcion || ""}
                readOnly
            />

            <label className="form-label">
                Documento adjunto:
            </label>
            
            <input
                className="form-input"
                type="text"
                value={prevValues.adjunto?.name || "Documento cargado"}
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