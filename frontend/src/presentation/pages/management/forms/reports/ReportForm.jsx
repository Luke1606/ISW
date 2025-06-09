import PropTypes from 'prop-types'
import { CheckCheck } from 'lucide-react'
import { datatypes } from '@/data'
import { FormButtons, MultiSearchableSelect, CheckeableListItem } from '@/presentation'
import { useReportForm } from '@/logic'

const ReportForm = ({ closeFunc }) => {
    const {
        user, 
        users,
        formik,
        selectAll,
        translate,
        selectedUsers,
        handleSelectUser,
        handleUserTypeChange, 
        AVAILABLE_USER_INFO_MAPPING,
    } = useReportForm(closeFunc)

    return (
        <section
            className='form-container'
            >
            <h1 
                className='form-title'
                >
                Generar reporte
            </h1>

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
                                
                                    >
                                    Tipo de usuario a reportar:

                                    <div 
                                        className='form-radio-container'
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
                                                onChange={handleUserTypeChange}
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
                                                onChange={handleUserTypeChange}
                                                />
                                            Profesores
                                        </label>
                                    </div>
                                </label>
                            </>}
                        
                        <span
                            className={`error ${!formik.errors.userType && 'hidden'}`}
                            >
                            {formik.errors.userType}
                        </span>

                        <label 
                            className='form-label' 
                            htmlFor='elements-info'
                            >
                            Categorías de los usuarios a reportar:
                        </label>
                    
                        <MultiSearchableSelect 
                            id='elements-info'
                            title='Datos a reportar de los usuarios seleccionados'
                            elements={AVAILABLE_USER_INFO_MAPPING.map(
                                (info) => ({ value: info, label: translate(info) }
                            ))}
                            onChange={(value) => formik.setFieldValue('selectedUsersInfo', value)}
                            />
                
                        <span
                            className={`error ${!formik.errors.selectedUsersInfo && 'hidden'}`}
                            >
                            {formik.errors.selectedUsersInfo}
                        </span>
                    </section>

                    {user.user_role !== datatypes.user.student &&
                        <section
                            className='manage-section'
                            >
                            <label 
                                className='form-label' 
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
                                    users?.map((userItem, index) => (
                                        <CheckeableListItem 
                                            key={`${userItem.id}-${index}`} 
                                            item={userItem}
                                            checked={selectedUsers.includes(userItem.id)}
                                            setSelectedItems={handleSelectUser}
                                            />)
                                        )
                                    :
                                    <h3 className='list-item-title'>
                                        No hay elementos que mostrar.
                                    </h3>}
                            </div>

                            <span
                                className={`error ${!formik.errors.selectedUsers && 'hidden'}`}
                                >
                                {formik.errors.selectedUsers}
                            </span>
                        </section>}
                </section>

                <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
            </form>
        </section>
    )
}

ReportForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
}

export default ReportForm