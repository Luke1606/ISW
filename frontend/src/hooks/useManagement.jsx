import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ManagementService from "../services/ManagementService"


const useList = (datatype, id) => {
    const [ data, setData ] = useState([])
    const [ items, setItems ] = useState([])
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ loading, setLoading ] = useState(true)
    
    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await ManagementService.getAllData(datatype, id)    
            setData(response.data)
        } catch (error) {
            console.log("Error al cargar los datos: " + error)
        }finally{   
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            await ManagementService.deleteData(datatype, id)    
        } catch (error) {
            console.log("Error al borrar el datos: " + error)
        }finally{   
            fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    },[datatype, id])

    useEffect(() => {
        const search = (item) => { 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) //aun solo busca por el nombre
        }

        const filteredData = data? Object.values(data).filter(item => search(item)) : null
    
        if (filteredData && filteredData.length > 0) {
            const itemsPerPage = 10

            const items = paginateData(filteredData, itemsPerPage)

            setItems(items)
        }else
            setItems([])
    }, [searchTerm, data])

    return { items, loading, searchTerm, setSearchTerm, handleDelete }
}

const paginateData = (data, itemsPerPage) => {
    if (!data || data.length === 0) return []

    return Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, rowIndex) => {
        return data.slice(rowIndex * itemsPerPage, (rowIndex + 1) * itemsPerPage);
    })
}

const useForm = (dataType, idData) => {
    const navigate = useNavigate()
    
    const getPrevValues = async (dataType, id) => {
        const response = await ManagementService.getData(dataType, id)
        return response? response.data : null
    }

    const form = Array.from(new FormData(e.target))
    const data = Object.fromEntries(form)

    if (idData === 0)
        createData(dataType, data)
    else
        updateData(dataType, data)
}



export { useList, useForm }




