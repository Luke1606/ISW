import { useMemo, useState, useEffect, useRef } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { 
    useAuth, 
    useGenericForm, 
    ManagementService, 
    NotificationService, 
    useTranslateToSpanish,
    useLoading,
} from '@/logic'

const useReportForm = (closeFunc) => {
    const [ userType, setUserType ] = useState(datatypes.user.student)
    const { user } = useAuth()
    const userTypeRef = useRef('')
    const { setLoading } = useLoading()
    
    const initialValues = {
        userType: datatypes.user.student,
        selectedUsersInfo: [],
        selectedUsers: user.user_role === datatypes.user.student?
            [user.id]
            :
            []
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

    const [ users, setUsers ] = useState(
        user.user_role === datatypes.user.student?
            [{ id: user.id, name: user.name }] 
            :
            []
    )
    const [ selectedUsers, setSelectedUsers ] = useState(
        user.user_role === datatypes.user.student?
            [user.id]
            :
            []
    )

    useEffect(() => {
        const fetchUsers = async () => {
            let message = ''
            let success = false
            
            setLoading(true)
            
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
                setLoading(false)

                if (!success) {
                    const notification = {
                        title: 'Error',
                        message: message
                    }
                    NotificationService.showToast(notification, 'error')
                }
            }
        }

        if (user.user_role !== datatypes.user.student && userType !== userTypeRef.current) {
            setSelectedUsers([])
            userTypeRef.current = userType
            fetchUsers()
        }
    }, [ userType, user.user_role, setLoading ])

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
            users: values.selectedUsers,
            infos: values.selectedUsersInfo,
        }

        const { success, data, message } = await ManagementService.generateReport(newValues)

        if (success) {
            const blob = new Blob([data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(blob)
            window.open(fileURL, '_blank')
        }

        closeFunc()

        return {
            success,
            message
        }
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const handleUserTypeChange = (e) => {
        const userType = e.target.value

        if (formik.values.userType !== userType) {
            formik.setValues({
                'selectedUsers': [],
                'selectedUsersInfo': [],
                'userType': userType
            })
            setUserType(userType)
        }
    }

    const translate = useTranslateToSpanish()

    const selectAll = () => {
        const ids = Array.from(users.map(user => user.id))
        const allSelected = selectedUsers.length === ids.length && 
                            selectedUsers.every(id => ids.includes(id))
        setSelectedUsers(allSelected? [] : ids)
        formik.setFieldValue("selectedUsers", allSelected? [] : ids)
    }
    
    return { 
        user, 
        users,
        formik,
        selectAll, 
        translate, 
        selectedUsers,
        handleSelectUser,
        handleUserTypeChange, 
        AVAILABLE_USER_INFO_MAPPING,
    }
}

export default useReportForm