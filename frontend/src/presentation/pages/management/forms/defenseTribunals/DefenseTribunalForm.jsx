import { useMemo } from "react";
import * as Yup from "yup";
import useGenericForm from "../../../../../logic/hooks/common/useGenericForm";

const DefenseTribunalForm = ({ values = {}, functions = {} }) => {
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
        </form>
    );
}

export default DefenseTribunalForm