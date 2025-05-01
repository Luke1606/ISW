import { useMemo } from 'react'
import * as Yup from 'yup'
import { useDebouncedFunction, useGenericForm } from '@/logic'
import { SearchableSelect, FormButtons } from '@/presentation'
import { datatypes } from '@/data'

const DefenseTribunalForm = ({ datatype, modalId, closeModal, prevValues, handleSubmit }) => {
    let initialValues = datatype === datatypes.defense_tribunal?
        {
            defenseDate: prevValues.date || '',
            president: prevValues.president || '',
            secretary: prevValues.secretary || '',
            vocal: prevValues.vocal || '',
            tutors: prevValues.tutors || []
        }
        :
        { state: prevValues.state || '' }

    const getProfessors = useDebouncedFunction(() => {
        return []
    })

    const professors = getProfessors()

    const validationSchema = useMemo(() => {
        return datatype === datatypes.defense_tribunal?
            Yup.object().shape({
                defenseDate: Yup.date()
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
            })
            :
            Yup.object().shape({
                state: Yup.string()
                .required('Debe seleccionar "Aprobar" o "Desaprobar".')
                .oneOf(['aproved', 'unaproved'])
            })
        }, [datatype])

    const formik = useGenericForm( handleSubmit, initialValues, validationSchema)

    const professorOptions = professors.map((id, name)=> {
        return { value: id, label: name }
    })

    return (
        <form
            className='form-container manage-form'
            onSubmit={formik.handleSubmit}
            >
            <label 
                className='form-label' 
                htmlFor='defense-date'
                >
                Fecha de defensa:
            </label>
            
            <input
                className='form-input'
                id='defense-date'
                type='date'
                {...formik.getFieldProps('defenseDate')}
                />
            
            <span
                className='error'
                style={formik.errors.date && formik.touched.date ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.date}
            </span>

            <label 
                className='form-label' 
                htmlFor='president'
                >
                Presidente del tribunal:
            </label>
            
            <SearchableSelect elements={professorOptions}/>
            
            <span
                className="error"
                style={formik.errors.president && formik.touched.president ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.president}
            </span>

            <label 
                className='form-label' 
                htmlFor='secretary'
                >
                Secretario del tribunal:
            </label>
            
            <SearchableSelect elements={professorOptions}/>

            <span
                className='error'
                style={formik.errors.secretary && formik.touched.secretary ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.secretary}
            </span>

            <label 
                className='form-label' 
                htmlFor='vocal'
                >
                Vocal del tribunal:
            </label>
            
            <SearchableSelect elements={professorOptions}/>
            
            <span
                className='error'
                style={formik.errors.vocal && formik.touched.vocal ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.vocal}
            </span>

            <label 
                className='form-label' 
                htmlFor='substitute'
                >
                Suplente del tribunal:
            </label>
            
            <SearchableSelect elements={professorOptions}/>
            
            <span
                className='error'
                style={formik.errors.substitute && formik.touched.substitute ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.substitute}
            </span>

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    )
}

export default DefenseTribunalForm