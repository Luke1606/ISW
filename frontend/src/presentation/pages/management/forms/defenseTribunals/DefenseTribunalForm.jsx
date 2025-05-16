import { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService, useLoading, NotificationService } from '@/logic'
import { SearchableSelect, FormButtons } from '@/presentation'

/**
 * @description Ventana para configurar o aprobar un tribunal.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @param {bool} `isDefenseTribunal`- Binario que expresa si es un formulario de configurar o aprobar tribunal.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const DefenseTribunalForm = ({ isDefenseTribunal, closeFunc, prevValues }) => {
    let initialValues = isDefenseTribunal?
        {
            defenseDate: prevValues?.date || '',
            president: prevValues?.president || '',
            secretary: prevValues?.secretary || '',
            vocal: prevValues?.vocal || '',
            opponent: prevValues?.opponent || '',
            tutorCant: prevValues?.tutors?.length || 1,
            tutors: prevValues?.tutors || Array(prevValues?.tutors?.length || 1).fill('')
        }
        :
        { state: prevValues?.state || '' }

    const [ professors, setProfessors ] = useState([])
    const [ selectedProfessors, setSelectedProfessors ] = useState([])

    const { setLoading } = useLoading()

    useEffect(() => {
        const getProfessors = async () => {
            setLoading(true)
            let message = ''
            let success = false
            let data = null
            try {
                const response = await ManagementService.getAllData(datatypes.user.professor)
                
                if (response?.success) {
                    success = true
                    data = response?.data?.data
                } else {
                    message = response?.message
                }
            } catch (error) {
                message = error.message
            } finally {
                if (!success) {
                    const notification = {
                        title: 'Error',
                        message: message
                    }
                    NotificationService.showToast(notification, 'error')
                }
                setLoading(false)
            }
            return data.map(professor => ({ 
                value: professor.id, 
                label: professor.name 
            }))    
        }

        setProfessors(getProfessors())
    }, [setLoading])

    const validationSchema = useMemo(() => {
        return isDefenseTribunal?
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

                opponent: Yup.string()
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
    }, [isDefenseTribunal])
    
    const submitFunction = async (values) => {
        const newValues = {
            id: prevValues?.id,
            student: prevValues?.student,
            president: values?.president || prevValues?.president,
            secretary: values?.secretary || prevValues?.secretary,
            vocal: values?.vocal || prevValues?.vocal,
            opponent: values?.opponent || prevValues?.opponent,
            date: values?.date || prevValues?.date,
            state: values?.state || prevValues?.state,
        }

        let success = false
        let message = ''
        
        const response = await ManagementService.updateData(datatypes.defense_tribunal, prevValues.id, newValues)
        
        success = response?.success
        message = response?.message

        closeFunc()

        return {
            success,
            message,
        }
    }

    const formik = useGenericForm( submitFunction, initialValues, validationSchema)

    
    useEffect(() => {
        const updatedSelections = Object.entries(formik.values)
            .filter(([key]) => key !== 'date' && key !== 'state')
            // eslint-disable-next-line no-unused-vars
            .map(([_, value]) => value)
            .filter(value => value !== '')
    
        setSelectedProfessors(updatedSelections)
    }, [formik.values])
    

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
                        title='Profesor a ocupar el cargo de presidente'
                        elements={professors.filter((option) => !selectedProfessors.includes(option))}
                        defaultValue={professors.find(option => option.value === prevValues?.president) || {}}
                        onChange={(value) => formik.setFieldValue('president', value)}
                        />
                    
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
                        title='Profesor a ocupar el cargo de secretario'
                        elements={professors.filter((option) => !selectedProfessors.includes(option))}
                        defaultValue={professors.find(option => option.value === prevValues?.president) || {}}
                        onChange={(value) => formik.setFieldValue('president', value)}
                        />

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
                        title='Profesor a ocupar el cargo de vocal'
                        elements={professors.filter((option) => !selectedProfessors.includes(option))}
                        defaultValue={professors.find(option => option.value === prevValues?.president) || {}}
                        onChange={(value) => formik.setFieldValue('president', value)}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.vocal && formik.touched.vocal ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.vocal}
                    </span>

                    <label 
                        className='form-label' 
                        htmlFor='opponent'
                        >
                        Vocal del tribunal:
                    </label>
                    
                    <SearchableSelect 
                        id='opponent'
                        title='Profesor a ocupar el cargo de oponente'
                        elements={professors.filter((option) => !selectedProfessors.includes(option))}
                        defaultValue={professors.find(option => option.value === prevValues?.president) || {}}
                        onChange={(value) => formik.setFieldValue('president', value)}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.opponent && formik.touched.opponent ? {} : { visibility: 'hidden' }}
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
                                    title={`Profesor a ocupar el cargo de tutor ${index}`}
                                    elements={professors.filter((option) => !selectedProfessors.includes(option))}
                                    defaultValue={professors.find(option => option.value === prevValues?.president) || {}}
                                    onChange={(value) => formik.setFieldValue('president', value)}
                                    />
                            </div>))}

                        <span
                            className='error'
                            style={formik.errors.tutors && formik.touched.tutors ? {} : { visibility: 'hidden' }}
                            >
                            {formik.errors.tutors}
                        </span>
                    </section>}
                </section>

            <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
        </form>
    )
}

DefenseTribunalForm.propTypes = {
    isDefenseTribunal: PropTypes.bool.isRequired,
    closeFunc: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        president: PropTypes.string,
        secretary: PropTypes.string,
        vocal: PropTypes.string,
        opponent: PropTypes.string,
        tutors: PropTypes.arrayOf(PropTypes.string),
        state: PropTypes.oneOf(['pending', 'aproved', 'unaproved'])
    }).isRequired
}

export default DefenseTribunalForm