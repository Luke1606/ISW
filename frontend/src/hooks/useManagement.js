import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import useDebouncedApiCall from './useDebouncedApiCall'
import ManagementService from '../services/ManagementService'
import { AuthContext } from "../contexts/AuthContext"
import datatypes from '../js-files/Datatypes'

const useList = (datatype, relatedUserId) => {
    const [state, setState] = useState({
        data: [[]],
        currentPage: 0,
        totalPages: 0,
        searchTerm: '',
        error: null,
        deleteConfirmationModalVisibility: false,
        selectedItemId: null,
    })
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const permissions = usePermisions(datatype, user)
    const [ options, setOptions ] = useState([])

    const formik = useFormik({
        initialValues: {search: ""},
        onSubmit: (values) => {
            setState(prev => ({ ...prev, searchTerm: values.search }))
            getData(values.search)
        }
    })

    const getData = useDebouncedApiCall(async (searchTerm) => {
        try {
            setState(prev => ({ ...prev, loading: true }))
            const response = await ManagementService.getAllData(datatype, searchTerm, relatedUserId)
            setState(prev => ({
                ...prev,
                data: response.data || [[]],
                totalPages: response.total_pages || 0,
                currentPage: 0,
                loading: false,
            }))
        } catch (error) {
            setState(prev => ({ ...prev, error, loading: false }))
        }
    })

    const getOptions = useDebouncedApiCall(async (datatype, user, selectedItemId) => {
        let options = []
        if (datatype === datatypes.student) {
            options.push({ value: `/tree`, label: 'Listar Evidencias' })
    
            const pendingRequests = await hasPendingRequests(selectedItemId)
            if (user?.role === datatypes.user.dptoInf && pendingRequests)
                options.push({ value: `/form`, label: 'Aprobar solicitud', params: { id: selectedItemId, datatype: datatypes.request } });
    
            const unconfiguredDefenseTribunal = await hasUnconfiguredDefenseTribunal(selectedItemId)
            if (user?.role === datatypes.user.dptoInf && unconfiguredDefenseTribunal)
                options.push({ value: `/form`, label: 'Configurar defensa y tribunal', params: { id: selectedItemId, datatype: datatypes.defense_tribunal } });
    
            if (user?.role !== datatypes.user.dptoInf && !unconfiguredDefenseTribunal)
                options.push({ value: `/form`, label: 'Ver datos de defensa y tribunal', params: { id: selectedItemId, datatype: datatypes.defense_tribunal, readOnly: true } });
    
            const pendingTribunal = await hasPendingTribunal(selectedItemId);
            if (user?.role === datatypes.user.decan && pendingTribunal) 
                options.push({ value: `/form`, label: 'Aprobar tribunal', params: { id: selectedItemId, datatype: datatypes.tribunal } })
    
            if (user?.role !== datatypes.user.professor)
                options.push({ value: `/tree`, label: 'Listar actas de defensa', params: { id: selectedItemId, datatype: datatypes.defense_act } })
    
            if (user?.role === datatypes.user.professor)
                options.push({ value: `/tree`, label: 'Gestionar actas de defensa', params: { id: selectedItemId, datatype: datatypes.defense_act } })
        }
        setOptions(options)
    }, 300)

    useEffect(() => {
        getData(state.searchTerm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.searchTerm])
    
    useEffect(() => {
        getOptions(datatype, user, state.selectedItemId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datatype, state.selectedItemId])

    const handlePageChange = (newPage) => {
        setState(prev => ({ ...prev, currentPage: newPage }))
    }

    const handleDelete = async (datatype, id, relatedUserId) => {
        try {
            await ManagementService.deleteData(datatype, id, relatedUserId)
            getData(state.searchTerm)
        } catch (error) {
            setState(prev => ({ ...prev, error }))
        }
    }

    const handleOptions = (event) => {
        const value = event.target.value;
        if (value) {
            navigate(value)
        }
    }

    return { formik, state, setState, permissions, options, handlePageChange, handleDelete, handleOptions, navigate }
}

const usePermisions = (datatype, user) => {
    let permissions = {
        add: false,
        edit: false,
        del: false,
        otherOptions: false,
    }

    switch (user?.role) {
        case datatypes.user.student:
            if (datatype === datatypes.evidence) {
                permissions.add = true
                permissions.edit = true
                permissions.del = true
            }
            break

        case datatypes.user.professor:
            if (datatype === datatypes.defense_act) {
                permissions.add = true
                permissions.edit = true
                permissions.del = true
            }else if (datatype === datatypes.user.student) 
                permissions.otherOptions = true
            break

        case datatypes.user.dptoInf:
            if (datatype === datatypes.user.student) 
                permissions.otherOptions = true
            break

        case datatypes.user.decan:
            if (datatype === datatypes.user.student || datatype === datatypes.user.professor) {
                permissions.add = true
                permissions.edit = true
                permissions.del = true
                permissions.otherOptions = true
            }
            break
    }

    return permissions
}

const hasPendingRequests = async (studentId) => {
    if(await ManagementService.getData(`/solicitud_pendiente/${studentId}`).data)
        return true
    return false
}

const hasUnconfiguredDefenseTribunal = async (studentId) => {
    if(await ManagementService.getData(`/defensa_tribunal_sin_configurar/${studentId}`).data)
        return true
    return false
}

const hasPendingTribunal = async (studentId) => {
    if(await ManagementService.getData(`/tribunal_pendiente/${studentId}`).data)
        return true
    return false
}

const useForm = (datatype, idData) => {
    const getPrevValues = useDebouncedApiCall(async (datatype, id) => {
        const response = await ManagementService.getData(datatype, id)
        return response? response.data : null
    })
    const prevValues = getPrevValues(datatype, idData)

    return { prevValues }
}



export { useList, useForm }




