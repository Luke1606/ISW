import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { datatypes } from '@/data'
import { ManagementService, useLoading, useAuth, useFormParams, NotificationService } from '@/logic'

const useListDataStates = (datatype, relatedUserId) => {
    const { setLoading } = useLoading()
    const [ changed, setChanged ] = useState(true)
    const [ data, setData ] = useState({})
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ currentData, setCurrentData ] = useState([])
    const [ totalPages, setTotalPages ] = useState(0)    
    
    const [ selectedItems, setSelectedItems ] = useState([])
    
    const getData = useCallback(async (searchTerm='') => {
        setLoading(true)
        let message = ''
        let success = false

        try {
            const response = await ManagementService.getAllData(datatype, searchTerm, relatedUserId)
            
            if (response?.success) {
                const data = response?.data || {}
                setData(data?.data)
                setTotalPages(data?.total_pages || 0)
                setCurrentPage(currentPage <= data?.total_pages? currentPage : 0)
                setCurrentData(Object.keys(data?.data || []).length > 0? data?.data[0] : [])
                success = true
            } else {
                message = response.message
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
            setLoading(false)
        }
    }, [datatype, relatedUserId, setLoading, currentPage])

    useEffect(() => {
        if (changed) {
            setSelectedItems([])
            getData()
            setChanged(false)
        }
    }, [getData, datatype, relatedUserId, changed])

    useEffect(() => {
        if (Object.keys(data || []).length > currentPage)
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
    const handleDelete = useCallback(async (datatype, ids=[], relatedUserId) => {
        setLoading(true)
        let message = ''
        let success = false
        try {
            if (ids) {
                const response = await ManagementService.deleteData(datatype, ids, relatedUserId)
                
                if (response?.success) {
                    setChanged(true)
                    success = true
                } else {
                    message = response?.message
                }
            } else {
                message = 'Se intento eliminar sin proporcionar elementos'
            }
        } catch (error) {
            message = error?.message
        } finally {
            if (!success) {
                const notification = {
                    title: 'Error',
                    message: message
                }
                NotificationService.showToast(notification, 'error')
            }
            setLoading(false)
        }
    }, [setLoading])
    
    // logica de seleccionar todos
    const selectAll = (all=false) => {
        const items = all? Object.values(data).flat() : currentData
        const ids = items.map(item => item.id)
        const allSelected = selectedItems.length === ids.length && 
                            selectedItems.every(id => ids.includes(id))

        setSelectedItems(allSelected? [] : ids)
    }

    const paginationParams = {
        totalPages: totalPages,
        currentPage: currentPage,
        handlePageChange: setCurrentPage,
        pageControl: true,
        loop: false,
    }

    return {
        selectAll,
        setChanged,
        currentData,
        handleSearch,
        handleDelete,
        selectedItems,
        setSelectedItems,
        paginationParams,
    }
}

const useItemTouchControl = (datatype) => {
    const [ selectedItemId, setSelectedItemId ] = useState('')
    const [ itemOptions, setItemOptions ] = useState([])
    const { user } = useAuth()
    const { openManageForm } = useFormParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getOptions = async () => {
            let options = []

            if (datatype === datatypes.user.student) {
                options.push({
                    action: () => navigate(`/list/${datatypes.evidence}/${selectedItemId}`),
                    label: 'Listar Evidencias',
                    value: 'evidence-list'
                })
                if (selectedItemId) {
                    const lastRequest = await (await ManagementService.getData(datatypes.request, selectedItemId)).data

                    if (user?.user_role === datatypes.user.dptoInf && lastRequest?.state === 'P')
                        options.push({ 
                            action: () => openManageForm(datatypes.request, { idData: selectedItemId}),
                            label: 'Aprobar solicitud',
                            value: 'aprove-request'
                        })
            
                    const defenseTribunal = await (await ManagementService.getData(datatypes.defense_tribunal, selectedItemId)).data
                    
                    if (user?.user_role === datatypes.user.dptoInf && defenseTribunal?.state === 'I')
                        options.push({ 
                            action: () => openManageForm(datatypes.defense_tribunal, { idData: selectedItemId}), 
                            label: 'Configurar defensa y tribunal',
                            value: 'config-tribunal'
                        })
            
                    if (user?.user_role !== datatypes.user.dptoInf && defenseTribunal?.state === 'A')
                        options.push({ 
                            action: () => openManageForm(datatypes.defense_tribunal, { idData: selectedItemId, view: true}), 
                            label: 'Ver datos de defensa y tribunal',
                            value: 'view-tribunal'
                        })
            
                    if (user?.user_role === datatypes.user.decan && defenseTribunal?.state === 'P')
                        options.push({ 
                            action: () => openManageForm(datatypes.tribunal, { idData: selectedItemId }), 
                            label: 'Aprobar tribunal',
                            value: 'aprove-tribunal'
                        })
            
                    if (user?.user_role !== datatypes.user.professor && defenseTribunal?.state === 'A')
                        options.push({ 
                            action: () => navigate(`/list/${datatypes.defense_act}/${selectedItemId}`), 
                            label: 'Listar actas de defensa',
                            value: 'list-defense_act'
                        })

                    if (user?.user_role === datatypes.user.professor && defenseTribunal?.state === 'A')
                        options.push({
                            action: () => navigate(`/list/${datatypes.defense_act}/${selectedItemId}`), 
                            label: 'Gestionar actas de defensa',
                            value: 'gest-defense_act'
                        })
                }
            }
            setItemOptions(options)
        }

        if (datatype===datatypes.user.student) {
            setItemOptions([])
            getOptions()
        }
    }, [datatype, selectedItemId, user, openManageForm, navigate])

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

const listHooks = { usePermisions, useItemTouchControl, useListDataStates }
export default listHooks