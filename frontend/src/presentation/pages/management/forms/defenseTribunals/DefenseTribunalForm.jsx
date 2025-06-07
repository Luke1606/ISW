import PropTypes from 'prop-types'
import { exerciseOptions } from '@/data'
import { SearchableSelect, FormButtons } from '@/presentation'
import { useDefenseTribunalForm } from '@/logic'

/**
 * @description Ventana para configurar o aprobar un tribunal.
 * @param {bool} `isDefenseTribunal`- Binario que expresa si es un formulario de configurar o aprobar tribunal.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const DefenseTribunalForm = ({ isDefenseTribunal, closeFunc, prevValues }) => {
    const { 
        professors, 
        selectedProfessors, 
        formik 
    } = useDefenseTribunalForm(isDefenseTribunal, closeFunc, prevValues)
    console.log(formik.errors);
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

            <p
                className='form-instructions'
                >
                El ECE seleccionado fue {exerciseOptions?.find((exercise) => exercise.value === prevValues?.selected_ece).label}
            </p>

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
                            Miembros del tribunal:
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
                            elements={professors?.filter((option) => !selectedProfessors?.includes(option.value))}
                            defaultValue={professors?.find(option => option.value === formik.values.president)}
                            onChange={(value) => formik.setFieldValue('president', value)}
                            />
                        
                        <span
                            className={`error ${!formik.errors.president && 'hidden'}`}
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
                            elements={professors?.filter((option) => !selectedProfessors?.includes(option.value))}
                            defaultValue={professors?.find(option => option.value === formik.values.secretary)}
                            onChange={(value) => formik.setFieldValue('secretary', value)}
                            />

                        <span
                            className={`error ${!formik.errors.secretary && 'hidden'}`}
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
                            elements={professors?.filter((option) => !selectedProfessors?.includes(option.value))}
                            defaultValue={professors?.find(option => option.value === formik.values.vocal)}
                            onChange={(value) => formik.setFieldValue('vocal', value)}
                            />
                        
                        <span
                            className={`error ${!formik.errors.vocal && 'hidden'}`}
                            >
                            {formik.errors.vocal}
                        </span>

                        <label 
                            className='form-label' 
                            htmlFor='opponent'
                            >
                            Oponente del tribunal:
                        </label>
                        
                        <SearchableSelect 
                            id='opponent'
                            title='Profesor a ocupar el cargo de oponente'
                            elements={professors?.filter((option) => !selectedProfessors?.includes(option.value))}
                            defaultValue={professors?.find(option => option.value === formik.values.opponent)}
                            onChange={(value) => formik.setFieldValue('opponent', value)}
                            />
                        
                        <span
                            className={`error ${!formik.errors.opponent && 'hidden'}`}
                            >
                            {formik.errors.opponent}
                        </span>
                    </section>

                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Otros:
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
                            value={formik.values.defenseDate? formik.values.defenseDate : ''}
                            onChange={(event) => formik.setFieldValue('defenseDate', event.target.value)}
                            />

                        <span
                            className={`error ${!formik.errors.defenseDate && 'hidden'}`}
                            >
                            {formik.errors.defenseDate}
                        </span>

                        <label 
                            className='form-label' 
                            htmlFor='tutor-cant'
                            >
                            Cantidad de tutor(es) (máximo 4):
                        </label>

                        <SearchableSelect
                            id='tutor-cant'
                            title='Cantidad de tutores asociados al estudiante'
                            elements={Array.from({ length: 4 }, (_, index) => ({
                                value: `${index + 1}`,
                                label: String(index + 1)
                            }))}                            
                            defaultValue={{value: formik.values.tutorCant, label: formik.values.tutorCant}}
                            onChange={(value) => formik.setFieldValue('tutorCant', value || 1)}
                            />

                        <span
                            className={`error ${!formik.errors.tutorCant && 'hidden'}`}
                            >
                            {formik.errors.tutorCant}
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
                                    elements={professors?.filter((option) => !selectedProfessors?.includes(option.value))}
                                    defaultValue={prevValues?.tutors && professors?.find(option => option.value === formik.values.tutors[index])}
                                    onChange={(value) => {
                                        const tutors = [...formik.values.tutors]
                                        tutors[index] = value
                                        formik.setFieldValue('tutors', tutors)
                                    }}
                                    />
                            </div>))}

                        <span
                            className={`error ${!formik.errors.tutors && 'hidden'}`}
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
                            value={professors?.find(option => option.value === prevValues?.president)?.label || ''}
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
                            value={professors?.find(option => option.value === prevValues?.secretary)?.label || ''}
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
                            value={professors?.find(option => option.value === prevValues?.vocal)?.label || ''}
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
                            value={professors?.find(option => option.value === prevValues?.opponent)?.label || ''}
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
                            value={prevValues.defense_date instanceof Date?
                                prevValues.defense_date.toISOString().split('T')[0]
                                :
                                prevValues.defense_date}
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
                                value={professors?.find(option => option.value === tutor)?.label || ''}
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
                                className={`error ${!(formik.errors.state && formik.touched.state) && 'hidden'}`}
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
        selected_ece: PropTypes.string.isRequired,
        defense_date: PropTypes.instanceOf(Date),
        president: PropTypes.string,
        secretary: PropTypes.string,
        vocal: PropTypes.string,
        opponent: PropTypes.string,
        tutors: PropTypes.array.isRequired,
        state: PropTypes.oneOf(['I', 'P', 'A', 'D']).isRequired
    }).isRequired
}

export default DefenseTribunalForm