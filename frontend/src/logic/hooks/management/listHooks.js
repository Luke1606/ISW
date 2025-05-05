import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ManagementService, useLoading, useAuth, useFormParams } from '@/logic'
import { datatypes } from '@/data'

const useListDataStates = (datatype, relatedUserId) => {
    const { setLoading } = useLoading()
    const [ data, setData ] = useState({})
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ currentData, setCurrentData ] = useState([])
    const [ totalPages, setTotalPages ] = useState(0)
    
    const getData = useCallback(async (searchTerm='') => {
        try {
            setLoading(true)
            const response = await ManagementService.getAllData(datatype, searchTerm, relatedUserId)

            setCurrentPage(0)
            setData(response?.data || {})
            setTotalPages(response?.totalPages || 0)

            setCurrentData(response.data && Object.keys(response.data).length > 0? response.data[0] : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [datatype, relatedUserId, setLoading])

    useEffect(() => {
        getData()
    }, [getData, datatype, relatedUserId])

    useEffect(() => {
        if (Object.keys(data).length > currentPage)
            setCurrentData(data[currentPage])
        else {
            setCurrentPage(0)
        }
    }, [data, currentPage])

    const handleSearch = (e) => {
        e.preventDefault()
        const searchTerm = e.target.elements.search.value
        getData(searchTerm)
    }

    // logica de eliminacion
    const handleDelete = async (datatype, id, relatedUserId) => {
        try {
            await ManagementService.deleteData(datatype, id, relatedUserId)
            getData()
        } catch (error) {
            console.error(error)
        }
    }

    const paginationParams = {
        totalPages: totalPages,
        currentPage: currentPage,
        handlePageChange: setCurrentPage,
        pageControl: true,
        loop: false,
    }

    return {
        currentData,
        paginationParams,
        handleSearch,
        handleDelete
    }
}

const useItemSelectionControl = (datatype) => {
    const [ selectedItemId, setSelectedItemId ] = useState('')
    const [ itemOptions, setItemOptions ] = useState([])
    const { user } = useAuth()
    const { openManageForm } = useFormParams()
    const navigate = useNavigate()

    const getOptions = useCallback(async () => {
        let options = []

        const hasPendingRequests = async (studentId) => {
            try {   
                if(await ManagementService.getData('solicitud_pendiente', studentId))
                    return true
                return false
            } catch (error) {
                console.error(error)
            }
        }
        
        const hasUnconfiguredDefenseTribunal = async (studentId) => {
            try {
                if(await ManagementService.getData('defensa_tribunal_sin_configurar', studentId))
                    return true
                return false
            } catch (error) {
                console.error(error)
            }
        }
        
        const hasPendingTribunal = async (studentId) => {
            try {
                if(await ManagementService.getData('tribunal_pendiente', studentId))
                    return true
                return false   
            } catch (error) {
                console.error(error)
            }
        }

        if (datatype === datatypes.user.student) {
            options.push({
                action: () => navigate(`/list/${datatypes.evidence}/${selectedItemId}`),
                label: 'Listar Evidencias'
            })
            if (selectedItemId) {
                const pendingRequests = await hasPendingRequests(selectedItemId) || false

                if (user?.user_role === datatypes.user.dptoInf /* && pendingRequests */)
                    options.push({ 
                        action: () => openManageForm(datatypes.request, { idData: selectedItemId}),
                        label: 'Aprobar solicitud', 
                        value: 'aprove-request'
                    })
        
                const unconfiguredDefenseTribunal = await hasUnconfiguredDefenseTribunal(selectedItemId) || true

                if (user?.user_role === datatypes.user.dptoInf /* && unconfiguredDefenseTribunal */)
                    options.push({ 
                        action: () => openManageForm(datatypes.defense_tribunal, { idData: selectedItemId}), 
                        label: 'Configurar defensa y tribunal',
                        value: 'config-tribunal'
                    })
        
                if (user?.user_role !== datatypes.user.dptoInf /* && !unconfiguredDefenseTribunal */)
                    options.push({ 
                        action: () => openManageForm(datatypes.defense_tribunal, { idData: selectedItemId, view: true}), 
                        label: 'Ver datos de defensa y tribunal',
                        value: 'view-tribunal'
                    })
        
                const pendingTribunal = await hasPendingTribunal(selectedItemId) || false
                if (user?.user_role === datatypes.user.decan /* && pendingTribunal */) 
                    options.push({ 
                        action: () => openManageForm(datatypes.tribunal, { idData: selectedItemId }), 
                        label: 'Aprobar tribunal',
                        value: 'aprove-tribunal'
                    })
        
                if (user?.user_role !== datatypes.user.professor /* && !unconfiguredDefenseTribunal && !pendingTribunal */)
                    options.push({ 
                        action: () => navigate(`/list/${datatypes.defense_act}`), 
                        label: 'Listar actas de defensa',
                        value: 'list-defense_act'
                    })

                if (user?.user_role === datatypes.user.professor /* && !unconfiguredDefenseTribunal && !pendingTribunal */)
                    options.push({
                        action: () => navigate(`/list/${datatypes.defense_act}`), 
                        label: 'Gestionar actas de defensa',
                        value: 'gest-defense_act'
                    })
            }
        }
        setItemOptions(options)
    }, [datatype, selectedItemId, user?.user_role, openManageForm, navigate])


    useEffect(() => {
        if (datatype===datatypes.user.student)
            getOptions()
    }, [datatype, selectedItemId, user, getOptions])

    const handleOptionChange = (event) => {
            const selectedOption = itemOptions.find(
                opt => opt.value === event.target.value
            )
            
            if (selectedOption) 
                selectedOption.action()
    }

    return {
        itemOptions,
        selectedItemId,
        setSelectedItemId,
        handleOptionChange,
    }
}

const usePermisions = (datatype) => {
    const { user } = useAuth()
    
    let permissions = {
        add: false,
        edit: false,
        del: false,
        otherOptions: false,
    }

    switch (user?.user_role) {
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

const listHooks = { usePermisions, useItemSelectionControl, useListDataStates }
export default listHooks