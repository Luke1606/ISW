import { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService, NotificationService } from '@/logic'
import { SearchableSelect, FormButtons } from '@/presentation'

/**
 * @description Ventana para configurar o aprobar un tribunal.
 * @param {bool} `isDefenseTribunal`- Binario que expresa si es un formulario de configurar o aprobar tribunal.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
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

    useEffect(() => {
        const fetchProfessors = async () => {
            let message = ''
            let success = false
            try {
                const response = await ManagementService.getAllData(datatypes.user.professor)

                if (response.success) {
                    const profs = Object.values(response?.data?.data)
                        .flat().map(
                            professor => ({
                                value: professor.id,
                                label: professor.name
                            })
                        )
                    success = true
                    if (profs) 
                        setProfessors(profs)
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
            }
        }

        if (isDefenseTribunal)
            fetchProfessors()
    }, [isDefenseTribunal])

    const validationSchema = useMemo(() => {
        return isDefenseTribunal?
            Yup.object().shape({
                defenseDate: Yup.string()
                    .required('La fecha es obligatoria')
                    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha incorrecto') // Valida formato YYYY-MM-DD
                    .test('valid-date', 'La fecha no puede ser en el pasado', value => {
                        if (!value) return false
                        const selectedDate = new Date(value)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0) // Elimina la hora para comparar solo la fecha
                        return selectedDate >= today
                    }),
        
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
                    .oneOf(['A', 'D'])
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

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)
    
    useEffect(() => {
        const updatedSelections = Object.entries(formik.values)
            .filter(([key]) => ['president', 'secretary', 'vocal', 'opponent', 'tutors'].includes(key))
            .flatMap(([key, value]) => key === 'tutors' && Array.isArray(value) ? value : [value])
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
            { isDefenseTribunal?
                <>
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
                            elements={professors.filter((option) => !selectedProfessors.includes(option.value))}
                            defaultValue={professors.find(option => option.value === prevValues?.president)}
                            onChange={(value) => formik.setFieldValue('president', value)}
                            />
                        
                        <span
                            className={`error ${formik.errors.president && formik.touched.president && 'hidden'}`}
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
                            elements={professors.filter((option) => !selectedProfessors.includes(option.value))}
                            defaultValue={professors.find(option => option.value === prevValues?.secretary)}
                            onChange={(value) => formik.setFieldValue('secretary', value)}
                            />

                        <span
                            className={`error ${formik.errors.secretary && formik.touched.secretary && 'hidden'}`}
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
                            elements={professors.filter((option) => !selectedProfessors.includes(option.value))}
                            defaultValue={professors.find(option => option.value === prevValues?.vocal)}
                            onChange={(value) => formik.setFieldValue('vocal', value)}
                            />
                        
                        <span
                            className={`error ${formik.errors.vocal && formik.touched.vocal && 'hidden'}`}
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
                            elements={professors.filter((option) => !selectedProfessors.includes(option.value))}
                            defaultValue={professors.find(option => option.value === prevValues?.opponent)}
                            onChange={(value) => formik.setFieldValue('opponent', value)}
                            />
                        
                        <span
                            className={`error ${formik.errors.opponent && formik.touched.opponent && 'hidden'}`}
                            >
                            {formik.errors.opponent}
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
                            className={`error ${formik.errors.defenseDate && formik.touched.defenseDate && 'hidden'}`}
                            >
                            {formik.errors.defenseDate}
                        </span>
                    </section>

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
                            min='1' 
                            max='4'
                            {...formik.getFieldProps('tutorCant')}
                            />

                        <span
                            className={`error ${formik.errors.tutorCant && formik.touched.tutorCant && 'hidden'}`}
                            >
                            {formik.errors.tutorCant}
                        </span>

                        {Array.from({ 
                            length: formik.values.tutorCant < 1?
                                1
                                :
                                formik.values.tutorCant > 4?
                                4
                                :
                                formik.values.tutorCant
                            }, (_, index) => (
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
                                    elements={professors.filter((option) => !selectedProfessors.includes(option.value))}
                                    defaultValue={prevValues?.tutors && professors.find(option => option.value === prevValues?.tutors[index])}
                                    onChange={(value) => formik.setFieldValue('tutors', [...(formik.values.tutors || []), value])}
                                    />
                            </div>))}

                        <span
                            className={`error ${formik.errors.tutors && formik.touched.tutors && 'hidden'}`}
                            >
                            {formik.errors.tutors}
                        </span>
                    </section>
                </>
                :
                <>
                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Miembros del tribunal
                        </h2>

                        <label 
                            className='form-label'
                            htmlFor='president'
                            >
                            Presidente del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='president'
                            type='text'
                            value={prevValues.president}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            htmlFor='secretary'
                            >
                            Secretario del tribunal:
                        </label>
                        <input
                            className='form-input'
                            id='secretary'
                            type='text'
                            value={prevValues.secretary}
                            readOnly
                        />

                        <label 
                            className='form-label'
                            htmlFor='vocal'
                            >
                            Vocal del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='vocal'
                            type='text'
                            value={prevValues.vocal}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            htmlFor='opponent'
                            >
                            Oponente del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='opponent'
                            type='text'
                            value={prevValues.opponent}
                            readOnly
                            />
                    </section>
                
                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Otros datos
                        </h2>
                        
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
                            value={prevValues.date instanceof Date ? prevValues.date.toISOString().split('T')[0] : prevValues.date}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            >
                            {prevValues.tutors? 'Tutores:' : 'No tiene tutores'}
                        </label>
                    
                        {prevValues.tutors && prevValues.tutors.map((tutor, index) => (
                            <input
                                key={index}
                                className='form-input'
                                type='text'
                                value={tutor}
                                readOnly
                                />
                        ))}

                            <label 
                                className='form-label'
                                htmlFor='state'
                                >
                                Qué veredicto desea tomar en cuanto al tribunal?
                            </label>

                            <div 
                                className='form-radio-container'
                                id='state'
                                >
                                <label 
                                    className='form-radio-option'
                                    >
                                    <input
                                        className='form-input'
                                        type='radio'
                                        name='state'
                                        value='A'
                                        checked={formik.values.state === 'A'}
                                        onChange={(e) => formik.setFieldValue('state', e.target.value)}
                                        />
                                    Aprobar
                                </label>
                                
                                <label 
                                    className='form-radio-option'
                                    >
                                    <input
                                        className='form-input'
                                        type='radio'
                                        name='state'
                                        value='D'
                                        checked={formik.values.state === 'D'}
                                        onChange={(e) => formik.setFieldValue('state', e.target.value)}
                                        />
                                    Denegar
                                </label>
                            </div>
                            
                            <span
                                className={`error ${formik.errors.state && formik.touched.state && 'hidden' }`}
                                >
                                {formik.errors.state}
                            </span>
                    </section>
                </>}
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
        tutors: PropTypes.PropTypes.string.isRequired,
        state: PropTypes.oneOf(['I', 'P', 'A', 'D']).isRequired
    }).isRequired
}

export default DefenseTribunalForm