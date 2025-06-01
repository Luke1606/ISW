import PropTypes from 'prop-types'
import { CheckCheck } from 'lucide-react'
import { datatypes } from '@/data'
import { FilePreviewer, FormButtons, SearchableSelect, CheckeableListItem } from '@/presentation'
import { useReportForm } from '@/logic'

const ReportForm = ({ closeFunc }) => {
    const { 
        user, 
        users,
        formik,
        sended, 
        reportPDF, 
        selectAll, 
        translate, 
        selectedUsers,
        setSelectedUsers,
        handleInfoTypeChange, 
        AVAILABLE_USER_INFO_MAPPING,
    } = useReportForm()

    return (
        <section
            className='form-container'
            >
            <h1 
                className='form-title'
                >
                Generar reporte
            </h1>

            { !sended?
                <form
                    onSubmit={formik.handleSubmit}
                    >
                    <section 
                        className='multi-layered-form'
                        >
                        <section 
                            className='manage-section'
                            >
                            <h2 
                                className='form-subtitle'
                                >
                                Datos del reporte
                            </h2>

                            { user.user_role === datatypes.user.decan &&
                                <>  
                                    <label 
                                        className='form-label'
                                        htmlFor='user-type'
                                        >
                                        Tipo de usuario a reportar:
                                    </label>

                                    <div 
                                        className='form-radio-container'
                                        id='user-type'
                                        >
                                        <label 
                                            className='form-radio-option'
                                            >
                                            <input
                                                className='form-input'
                                                type='radio'
                                                name='userType'
                                                value={datatypes.user.student}
                                                checked={formik.values.userType === datatypes.user.student}
                                                onChange={handleInfoTypeChange}
                                                />
                                            Estudiantes
                                        </label>
                                        
                                        <label 
                                            className='form-radio-option'
                                            >
                                            <input
                                                className='form-input'
                                                type='radio'
                                                name='userType'
                                                value={datatypes.user.professor}
                                                checked={formik.values.userType === datatypes.user.professor}
                                                onChange={handleInfoTypeChange}
                                                />
                                            Profesores
                                        </label>
                                    </div>
                                </>}
                        
                            <span
                                className={`error ${formik.errors.userType && formik.touched.userType && 'hidden'}`}
                                >
                                {formik.errors.userType}
                            </span>

                            <label 
                                className='form-label' 
                                htmlFor='elements-info'
                                >
                                Datos de los usuarios a reportar:
                            </label>
                        
                            <SearchableSelect 
                                id='elements-info'
                                title='Datos a reportar de los usuarios seleccionados'
                                defaultValue={formik.values.selectedElementsInfo?.map((info) => ({ value: info, label: translate(info)}))}
                                elements={AVAILABLE_USER_INFO_MAPPING.map((info) => ({ value: info, label: translate(info)}))}
                                onChange={(value) => formik.setFieldValue('selectedElementsInfo', value)}
                                isMulti={true}
                                />
                    
                            <span
                                className={`error ${formik.errors.selectedElementsInfo && formik.touched.selectedElementsInfo && 'hidden'}`}
                                >
                                {formik.errors.description}
                            </span>
                        </section>

                        <section
                            className='manage-section'
                            >
                            <label 
                                className='form-label' 
                                htmlFor='users'
                                >
                                Usuarios a reportar:
                            </label>

                            <button
                                title='Seleccionar todos'
                                type='button'
                                className='accept-button'
                                onClick={selectAll}
                                >
                                <CheckCheck size={40}/>
                            </button>

                            <div
                                className='manage-list report-list'
                                >
                                { users?.length > 0?
                                    users?.map((user, index) => (
                                        <CheckeableListItem 
                                            key={`${user.id}-${index}`} 
                                            item={user}
                                            checked={selectedUsers.includes(user.id)}
                                            setSelectedItems={setSelectedUsers}
                                            />)
                                        )
                                    :
                                    <h3 className='list-item-title'>
                                        No hay elementos que mostrar.
                                    </h3>}
                            </div>

                            <span
                                className={`error ${!(formik.errors.selectedElements && formik.touched.selectedElements && 'hidden')}`}
                                >
                                {formik.errors.description}
                            </span>
                        </section>
                    </section>

                    <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
                </form>
                :
                <>
                    <section
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Reporte generado en pdf
                        </h2>

                        {reportPDF?
                            <FilePreviewer 
                                source={reportPDF}
                                />
                        :
                        'Esperando respuesta...'}
                    </section>

                    <button 
                        className='accept-button'
                        onClick={closeFunc}
                        >
                        Cerrar
                    </button>
                </>}
        </section>
    )
}

ReportForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
}

export default ReportForm