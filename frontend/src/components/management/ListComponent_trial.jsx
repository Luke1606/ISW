import { useState, useEffect, useCallback, useParams } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { FixedSizeList } from 'react-window'
import { useFormik } from 'formik'
import LoadingSpinner from '../common/LoadingSpinner'

const List = () => {
    const { datatype, id } = useParams()
    const [state, setState] = useState({
        data: [],
        currentPage: 0,
        totalPages: 0,
        searchTerm: '',
        loading: false,
        error: null,
        isHybrid: false,
    })

    const formik = useFormik({
        initialValues: {search: ""},
        onSubmit: (values) => {
            setState(prev => ({ ...prev, searchTerm: values.search }))
            fetchData(values.search)
        }
    })

    const fetchData = useCallback(_.debounce(async (search) => {
        try {
            setState(prev => ({ ...prev, loading: true }))
            const response = await axios.get(`/api//${datatype}/${id ? `${id}/` : ''}/?search=${search}`)
            setState(prev => ({
                ...prev,
                data: response.data.data,
                totalPages: response.data.total_pages,
                currentPage: response.data.current_page,
                loading: false,
                isHybrid: response.data.total_pages > 100,
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error, loading: false }))
        }
    }, 300), [])

    useEffect(() => {
        fetchData(state.searchTerm)
    }, [state.searchTerm])

    
    const handlePageChange = (newPage) => {
        setState(prev => ({ ...prev, currentPage: newPage }))
    }

    return (
        <div>
            <form role="search" onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Buscar en Akademos..."
                    {...formik.getFieldProps("search")}/>

                <button type="submit">Buscar</button>
            </form>
            
            {state.loading && <LoadingSpinner/>}
            {state.error && <span className='error'>Error: {state.error.message}</span>}
            
            <FixedSizeList
                height={400}
                width={300}
                itemSize={10}
                itemCount={state.data.length}
            >
                {state.data[state.currentPage].map((item, index) =>  (
                        <div key={index} className='list-item'>
                            {item.name}
                        </div>
                    )
                )}
            </FixedSizeList>

            <div className='button-group pagination-button-group'>
                <button 
                    onClick={() => handlePageChange(state.currentPage - 1)}
                    disabled={state.currentPage===0}>
                        Anterior
                </button>
                {Array.from({ length: state.totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        disabled={index === state.currentPage}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(state.currentPage + 1)}
                    disabled={state.currentPage===state.totalPages}>
                        Siguiente
                </button>
            </div>
        </div>
    )
}

export default List
