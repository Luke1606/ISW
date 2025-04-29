import PropTypes from "prop-types"
import { useMemo } from "react"
import * as Yup from "yup"
import useGenericForm from "../../../../../logic/hooks/common/useGenericForm"
import datatypes from "../../../../../data/datatypes"
import FormButtons from "../../../../components/FormButtons"

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal`- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @param {function} `handleSubmit`- Función a ejecutar al envío del formulario.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
export const RequestForm = ({ modalId, closeModal, prevValues, handleSubmit }) => {
    const initialValues = {
        selectedECE: prevValues.selected_ece || '',
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        studentName: Yup.string()
            .required('El nombre del estudiante es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        
        selectedECE: Yup.string()
            .required('Debe seleccionar un ejercicio'),
            
        additionalInfo: Yup.string()
            .max(500, 'La información adicional no puede exceder los 500 caracteres')
    }), [])

    const submitFunction = async (values) => {
        const newValues = {
            name: values?.name,
            faculty: values?.faculty,
            attachment: values?.attachment,
        }
        await handleSubmit(datatypes.request, prevValues?.id, newValues)
        closeModal(modalId)
    }
    const formik = useGenericForm(
        submitFunction,
        initialValues,
        validationSchema
    )

    const exerciseOptions = [
        { value: 'TD', label: 'Trabajo de diploma'},
        { value: 'PF', label: 'Portafolio'},
        { value: 'AA', label: 'Defensa de Artículos Científicos'},
        { value: 'EX', label: 'Exhimición'},  
    ]

    const printOptions = (option) => (
        <option 
            key={option.value} 
            value={option.value}
            className='option-element'
            >
            {option.label}
        </option>
    )
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

            <label className="form-label" htmlFor="selectedECE">
                Seleccione el ejercicio deseado:
            </label>
            
            <select
                className="form-select"
                id="selectedECE"
                {...formik.getFieldProps('selectedECE')}
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
                style={formik.errors.selectedECE && formik.touched.selectedECE ? {} : { visibility: "hidden" }}
            >
                {formik.errors.selectedECE}
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

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    );
};

RequestForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        selected_ece: PropTypes.string.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
}