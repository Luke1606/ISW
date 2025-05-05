import { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useGenericForm } from '@/logic'
import { SearchableSelect, FormButtons } from '@/presentation'
import { datatypes } from '@/data'

const DefenseTribunalForm = ({ datatype, modalId, closeModal, prevValues, handleSubmit }) => {
    const isDefenseTribunal = datatype === datatypes.defense_tribunal
    let initialValues = isDefenseTribunal?
        {
            defenseDate: prevValues?.date || '',
            president: prevValues?.president || '',
            secretary: prevValues?.secretary || '',
            vocal: prevValues?.vocal || '',
            tutorCant: prevValues?.tutors?.length || 1,
            tutors: prevValues?.tutors || Array(prevValues?.tutors?.length || 1).fill('')
        }
        :
        { state: prevValues?.state || '' }

    const getProfessors = useCallback(() => {
        return []
    }, [])

    const professors = getProfessors()

    const validationSchema = useMemo(() => {
        return datatype === datatypes.defense_tribunal?
            Yup.object().shape({
                defenseDate: Yup.date()
                    .required('La fecha es obligatoria')
                    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha incorrecto')
                    .min(new Date(), 'La fecha no puede ser en el pasado'),
            
                president: Yup.string()
                .required('El presidente es requerido'),
            
                secretary: Yup.string()
                .required('El secretario es requerido'),
                
                vocal: Yup.string()
                .required('El vocal es requerido'),

                tutorCant: Yup.number()
                    .required('La cantidad de tutor(es) es obligatoria')
                    .min(1, 'El estudiante debe tener como mínimo un(1) tutor')
                    .max(4, 'El estudiante debe tener como máximo cuatro(4) tutores'),
                
                tutors: Yup.array()
                .of(Yup.string().required('Debe seleccionar un tutor'))
                .min(Yup.ref('tutorCant'), 'Debe seleccionar todos los tutores')
                .max(Yup.ref('tutorCant'), 'No debe seleccionar más tutores de los especificados')
            })
            :
            Yup.object().shape({
                state: Yup.string()
                .required('Debe seleccionar "Aprobar" o "Desaprobar".')
                .oneOf(['aproved', 'unaproved'])
            })
        }, [datatype])

    const formik = useGenericForm( handleSubmit, initialValues, validationSchema)

    const professorOptions = professors.map(professor => ({ 
        value: professor.id, 
        label: professor.name 
    }))    

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                {isDefenseTribunal? 'Configurar defensa y' : 'Aprobar'} tribunal
            </h1>
            <section 
                className='multi-layered-form'
                >
                <section 
                    className='manage-section'
                    >
                    <h2 
                        className='form-subtitle'
                        >
                        Miembros del tribunal y fecha de la defensa:
                    </h2>

                    <label 
                        className='form-label' 
                        htmlFor='president'
                        >
                        Presidente del tribunal:
                    </label>
                    
                    <SearchableSelect 
                        id='president'
                        elements={professorOptions}/>
                    
                    <span
                        className='error'
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
                    
                    <SearchableSelect 
                        id='secretary'
                        elements={professorOptions}/>

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
                    
                    <SearchableSelect 
                        id='vocal'
                        elements={professorOptions}/>
                    
                    <span
                        className='error'
                        style={formik.errors.vocal && formik.touched.vocal ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.vocal}
                    </span>

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
                        style={formik.errors.defenseDate && formik.touched.defenseDate? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.defenseDate}
                    </span>
                </section>

                { !isDefenseTribunal &&
                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Tutores:
                        </h2>
                        <label 
                            className='form-label' 
                            htmlFor='tutor-cant'
                            >
                            Cantidad de tutor(es) del estudiante (máximo 4):
                        </label>

                        <input
                            className='form-input'
                            id='tutor-cant'
                            type='number'
                            defaultValue={1}
                            min='1' 
                            max='4'
                            {...formik.getFieldProps('tutorCant')}
                            />

                        <span
                            className='error'
                            style={formik.errors.tutorCant && formik.touched.tutorCant? {} : { visibility: 'hidden' }}
                            >
                            {formik.errors.tutorCant}
                        </span>

                        {Array.from({ length: formik.values.tutorCant || 1 }, (_, index) => (
                            <div key={index}>
                                <label 
                                    className='form-label' 
                                    htmlFor={`tutor${index}`}
                                    >
                                    Tutor {index + 1}:
                                </label>

                                <SearchableSelect
                                    id={`tutor${index}`}
                                    elements={professorOptions}/>
                            </div>))}

                        <span
                            className='error'
                            style={formik.errors.tutors && formik.touched.tutors ? {} : { visibility: 'hidden' }}
                            >
                            {formik.errors.tutors}
                        </span>
                    </section>}
                </section>

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    )
}

DefenseTribunalForm.propTypes = {
    datatype: PropTypes.oneOf([datatypes.tribunal, datatypes.defense_tribunal]),
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        president: PropTypes.string,
        secretary: PropTypes.string,
        vocal: PropTypes.string,
        opponent: PropTypes.string,
        tutors: PropTypes.arrayOf(PropTypes.string),
        state: PropTypes.oneOf(['pending', 'aproved', 'unaproved'])
    })
}

export default DefenseTribunalForm