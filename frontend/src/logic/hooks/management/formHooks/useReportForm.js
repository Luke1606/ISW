import { useMemo, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { ManagementService, NotificationService, useGenericForm, useAuth, useTranslateToSpanish } from '@/logic'

const useReportForm = () => {
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

    return { 
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
    }
}

export default useReportForm