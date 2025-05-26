import PropTypes from 'prop-types'
import { useMemo, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { CheckCheck } from 'lucide-react'
import { datatypes } from '@/data'
import { ManagementService, NotificationService, useGenericForm, useAuth, useTranslateToSpanish } from '@/logic'
import { FilePreviewer, FormButtons, SearchableSelect, CheckeableListItem } from '@/presentation'

const ReportForm = ({ closeFunc }) => {
    const [ sended, setSended ] = useState(false)
    const [ reportPDF, setReportPDF ] = useState(null)
    const [ userType, setUserType ] = useState(datatypes.user.student)
    const { user } = useAuth()

    const initialValues = {
        userType: userType,
        selectedUsers: [],
        selectedUsersInfo: [],
    }

    const AVAILABLE_USER_INFO_MAPPING = useMemo(() => {
        const role = user.user_role
        if (role === datatypes.user.student) 
            return [datatypes.evidence, datatypes.request, datatypes.defense_tribunal]
        if (role === datatypes.user.decan) {
            if (userType === datatypes.user.student)
                return [datatypes.evidence, datatypes.request, datatypes.defense_tribunal, datatypes.defense_act]
            else
                return [datatypes.defense_act]
        } else
            return [datatypes.evidence, datatypes.request, datatypes.defense_tribunal, datatypes.defense_act]
    }, [user.user_role, userType])

    const [ users, setUsers ] = useState([])
    const [ selectedUsers, setSelectedUsers ] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            let message = ''
            let success = false
            try {
                const response = await ManagementService.getAllData(userType)

                if (response.success) {
                    const usersList = Object.values(response?.data?.data).flat()
                    success = true

                    if (usersList) 
                        setUsers(usersList)
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
        setSelectedUsers([])
        fetchUsers()
    }, [userType])

    const validationSchema = useMemo(() => Yup.object().shape({
        userType: Yup.string()
            .required('La información a reportar es obligatoria')
            .oneOf(
                user.user_role === datatypes.user.decan?
                    [datatypes.user.student, datatypes.user.professor]
                    :
                    [datatypes.user.student]
                ),
        
        selectedElements: Yup.array()
            .of(Yup.object().shape({
                id: Yup.string().required(),
                name: Yup.string().required(),
            })),
    
        
        selectedElementsInfo: Yup.array()
            .required('La información a reportar de los elementos seleccionados es obligatoria')
            .oneOf(AVAILABLE_USER_INFO_MAPPING),
    }), [user.user_role, AVAILABLE_USER_INFO_MAPPING])

    const submitFunction = async (values) => {
        const newValues = {
            type: user.user_role === datatypes.user.student?
                datatypes.user.student 
                : 
                values.userType,
            users: user.user_role === datatypes.user.student?
                user.id
                : 
                values.selectedUsers,
            infos: values.selectedUsersInfo,
        }
        const { success, data, message } = await ManagementService.generateReport(newValues)

        setSended(true)

        if (success) {
            setReportPDF(data)
        }

        return {
            success,
            message
        }
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const handleInfoTypeChange = (e) => {
        const userType = e.target.value

        if (formik.values.userType !== userType) {
            formik.setFieldValue('selectedUsers', [])
            formik.setFieldValue('selectedUsersInfo', [])
            formik.setFieldValue('userType', userType)
            setUserType(userType)
        }
    }

    const translate = useTranslateToSpanish()

    const selectAll = () => {
        const ids = Object.values(users).map(user => user.id)
        const allSelected = selectedUsers.length === ids.length && 
                            selectedUsers.every(id => ids.includes(id))
        setSelectedUsers(allSelected? [] : ids)
    }

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
                                className='error'
                                style={formik.errors.userType && formik.touched.userType ? {} : { visibility: 'hidden' }}
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
                                className='error'
                                style={formik.errors.description && formik.touched.description ? {} : { visibility: 'hidden' }}
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
                                className={`error ${formik.errors.description && formik.touched.description && 'hidden'}`}
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