import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ManagementService, useLoading, useAuth } from '@/logic'
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
    const [ selectedItemId, setSelectedItemId ] = useState(null)
    const [ itemOptions, setItemOptions ] = useState([])
    const { user } = useAuth()

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
                value: `/list/${datatypes.evidence}/${selectedItemId}`,
                label: 'Listar Evidencias'
            })
            if (selectedItemId) {
                const pendingRequests = await hasPendingRequests(selectedItemId) || false

                if (user?.user_role === datatypes.user.dptoInf /* && pendingRequests */)
                    options.push({ 
                        value: `/form/${datatypes.request}/${selectedItemId}`, 
                        label: 'Aprobar solicitud' 
                    })
        
                const unconfiguredDefenseTribunal = await hasUnconfiguredDefenseTribunal(selectedItemId) || true

                if (user?.user_role === datatypes.user.dptoInf /* && unconfiguredDefenseTribunal */)
                    options.push({ 
                        value: `/form/${datatypes.defense_tribunal}/${selectedItemId}`, 
                        label: 'Configurar defensa y tribunal'
                    })
        
                if (user?.user_role !== datatypes.user.dptoInf /* && !unconfiguredDefenseTribunal */)
                    options.push({ 
                        value: `/form/${datatypes.defense_tribunal}/${selectedItemId}/${true}`, 
                        label: 'Ver datos de defensa y tribunal' 
                    })
        
                const pendingTribunal = await hasPendingTribunal(selectedItemId) || false
                if (user?.user_role === datatypes.user.decan /* && pendingTribunal */) 
                    options.push({ 
                        value: `/form/${datatypes.tribunal}/${selectedItemId}`, 
                        label: 'Aprobar tribunal'
                    })
        
                if (user?.user_role !== datatypes.user.professor /* && !unconfiguredDefenseTribunal && !pendingTribunal */)
                    options.push({ 
                        value: `/list/${datatypes.defense_act}`, 
                        label: 'Listar actas de defensa'
                    })

                if (user?.user_role === datatypes.user.professor /* && !unconfiguredDefenseTribunal && !pendingTribunal */)
                    options.push({
                        value: `/list/${datatypes.defense_act}`, 
                        label: 'Gestionar actas de defensa'
                    })
            }
        }
        setItemOptions(options)
    }, [datatype, selectedItemId, user?.user_role])


    useEffect(() => {
        if (datatype===datatypes.user.student)
            getOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datatype, selectedItemId, user])

    // logica para cuando se seleccione una opcion de un elemento estudiante
    const navigate = useNavigate()

    const handleOptions = (event) => {
        const value = event.target.value
        if (value) {
            navigate(value)
        }
    }

    return {
        itemOptions,
        handleOptions,
        selectedItemId,
        setSelectedItemId
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