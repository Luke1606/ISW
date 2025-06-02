import { useMemo, useState, useEffect, useRef } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { 
    useAuth, 
    useGenericForm, 
    ManagementService, 
    NotificationService, 
    useTranslateToSpanish 
} from '@/logic'

const useReportForm = () => {
    const [ sended, setSended ] = useState(false)
    const reportPDFRef = useRef(null)
    const [ userType, setUserType ] = useState(datatypes.user.student)
    const { user } = useAuth()

    const initialValues = {
        userType: datatypes.user.student,
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
        if (!sended) {
            setSelectedUsers([])
            fetchUsers()
        }
    }, [userType, sended])

    const handleSelectUser = (updateFn) => {
        setSelectedUsers((prev) => {
            const updatedUsers = typeof updateFn === "function" ? updateFn(prev) : updateFn
            formik.setFieldValue("selectedUsers", updatedUsers)
            return updatedUsers
        })
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        userType: Yup.string()
            .required('El tipo de usuario a reportar reportar es obligatorio')
            .oneOf(
                user.user_role === datatypes.user.decan?
                    [datatypes.user.student, datatypes.user.professor]
                    :
                    [datatypes.user.student]
                , 'El tipo de usuario a reportar solo puede ser de las opciones mostradas'),
        
        selectedUsers: Yup.array()
            .min(1, 'Debe seleccionar al menos un usuario')
            .max(users.length || 0, 'No puede seleccionar más usuarios de los existentes')
            .of(Yup.string()
                .oneOf(users.map((user) => user.id), 'Solo puede seleccionar los usuarios existentes')
            ),
    
        
        selectedUsersInfo: Yup.array()
            .required('La información a reportar de los usuarios seleccionados es obligatoria')
            .min(1, 'Debe seleccionar al menos una categoría')
            .max(AVAILABLE_USER_INFO_MAPPING.length, 'No puede seleccionar más categorías que las permitidas')
            .of(Yup.string()
                    .oneOf(AVAILABLE_USER_INFO_MAPPING
                        , 'Las categorias a reportar solo pueden ser de las opciones mostradas')
            ),
    }), [user.user_role, AVAILABLE_USER_INFO_MAPPING, users])
    
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

        if (success) {
            reportPDFRef.current = data
        }

        setSended(true)

        return {
            success,
            message
        }
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const handleUserTypeChange = (e) => {
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
        selectAll, 
        translate, 
        reportPDFRef, 
        selectedUsers,
        handleSelectUser,
        handleUserTypeChange, 
        AVAILABLE_USER_INFO_MAPPING,
    }
}

export default useReportForm