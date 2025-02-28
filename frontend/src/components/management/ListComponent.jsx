import { useState, useContext, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useList } from "../../hooks/useManagement"
import { UserContext } from "../../contexts/UserContext"
import LoadingSpinner from "../common/LoadingSpinner"
import { ConfirmModal } from "../common/Modal"
import { datatypes, usertypes } from "../../js-files/Datatypes"

const ListComponent = () => {
    const { datatype, id } = useParams()
    const { items, loading, handleDelete } = useList(datatype, id)
    const [ selectedItemId, setSelectedItemId ] = useState(0)
    const [
        isModalOpen, setModalOpen,
        optionsVisibility, setOptionsVisibility
    ] = useState(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if(selectedItemId !== 0)
            setOptionsVisibility(false)
    }, [selectedItemId])

    const itemize = (item, index) => {

        const permissions = {
            edit: false,
            del: false,
        }
        
        return (
            <li 
            key={index}
            className="list-item">
            {item.name}
    
            <div className="list-button-container">
                {permissions.edit && 
                    <button className="edit-button" onClick={() => setSelectedItemId(item.id)}>
                        <Link to='/form'
                            id={item.id}
                            datatype={datatype}
                            >
                            Editar
                        </Link>
                    </button> }
    
                {permissions.del &&
                    <button 
                    className="delete-button" onClick={() => { setModalOpen(true) }}>
                        Eliminar
                    </button>}
                
                <button onClick={() => setSelectedItemId(item.id)}>
                    <Link
                        to="/form"
                        id={selectedItemId}
                        readOnly={true}
                        >
                        Ver detalles
                    </Link>
                </button>
                { datatype==datatypes.student && <button onClick={() => {setOptionsVisibility(true)}}>Opciones</button> }
                { optionsVisibility && showOptions() }
            </div>
        </li>
        )
    }

    const IndexButtons = () => {
        const [ index, setIndex ] = useState(0)
        
        const handleIndexClick = (index) => setIndex(index)
        
        return (
    
            <ul className="button-container">
                {index > 0 &&
                    <li>
                        <button 
                            className="index-button"
                            onClick={() => handleIndexClick(index - 1)}>
                            Anterior
                        </button>
                    </li>}
    
                {Array.from({ length : items.length }, (_, idx) => (
                    <li key={idx}>
                        <button
                            className="button"
                            onClick={() => handleIndexClick(idx)}> 
                                {idx + 1} 
                            </button>
                    </li>))}
    
                {index < (items.length - 1) &&
                    <li>
                        <button 
                            className="index-button"
                            onClick={() => handleIndexClick(index + 1)}>
                            Siguiente
                        </button>
                    </li>}
            </ul>
        )
    }

    const showOptions = async () => {
        return (
            <>
            { datatype==datatypes.student && optionsVisibility && 
                <div className="list-options">
                    <ul>
                        <li>
                            <Link
                                to="/tree"
                                id={selectedItemId}
                                datatype={datatypes.evidence}>
                                Listar Evidencias
                            </Link>
                        </li>
    
                        { user.type === usertypes.dptoInf && await hasPendingRequests(selectedItemId) &&
                        <li>
                            <Link 
                                to="/form"
                                id={selectedItemId}
                                datatype={datatypes.request}>
                                Aprobar solicitud
                            </Link>
                        </li>}
    
                        { user.type === usertypes.dptoInf && await hasUnconfiguredDefenseTribunal(selectedItemId) &&
                        <li>
                            <Link
                                to="/form"
                                id={selectedItemId}
                                datatype={datatypes.defense_tribunal}>
                                Configurar defensa y tribunal
                            </Link>
                        </li>}
    
                        { user.type !== usertypes.dptoInf && await !hasUnconfiguredDefenseTribunal(selectedItemId) &&
                        <li>
                            <Link
                                to="/form"
                                id={selectedItemId}
                                datatype={datatypes.defense_tribunal}
                                readOnly={true}>
                                Ver datos de defensa y tribunal
                            </Link>
                        </li>}
    
                        { user.type === usertypes.decan && await hasPendingTribunal(selectedItemId) &&
                        <li>
                            <Link
                                to="/form"
                                id={selectedItemId}
                                datatype={datatypes.tribunal}>
                                Aprobar tribunal
                            </Link>
                        </li>}
    
                        { user.type !== usertypes.professor &&
                        <li>
                            <Link
                                to="/tree"
                                id={selectedItemId}
                                datatype={datatypes.defense_act}>
                                Listar actas de defensa
                            </Link>
                        </li>}
    
                        { user.type === usertypes.professor &&
                        <li>
                            <Link
                                to="/tree"
                                id={selectedItemId}
                                datatype={datatypes.defense_act}>
                                Gestionar actas de defensa
                            </Link>
                        </li>}
                    </ul>
                </div> }
            </>
        )
    }

    return (
        <div className="manage-container">  
            <SearchBar />          
            <button className="add-button" > 
                <Link to='../pages/Form'
                    datatype={datatype}>
                    Agregar
                </Link> 
            </button>

            {items.length > 0 ? (
                items.map((itemGroup, rowIndex) => (
                    <ul key={rowIndex} className="manage-list">
                        {itemGroup.map((item, index) => (
                            itemize(item, index)
                        ))}
                    </ul>
                ))
            ) : (
                <li key="no-items">No hay elementos que mostrar.</li>
            )}

            <IndexButtons/>

            {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
            <ConfirmModal isOpen={isModalOpen} onConfirm={handleDelete} onClose={ setModalOpen(false) }></ConfirmModal>
        </div>
    )
}

export default ListComponent

const SearchBar = () => {
    const { SearchTerm, setSearchTerm } = useList()
    return (
        <form role="search" 
            className="search-form">
            <input 
                type="text" 
                placeholder="Buscar en Akademos..." 
                value={SearchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }} 
                />
        </form>
    )
}

const hasPendingRequests = async (studentId) => {
    return await this.getData(`/solicitud_pendiente/${studentId}`).data
}

const hasUnconfiguredDefenseTribunal = async (studentId) => {
    return await this.getData(`/defensa_tribunal_sin_configurar/${studentId}`).data
}

const hasPendingTribunal = async (studentId) => {
    return await this.getData(`/tribunal_pendiente/${studentId}`).data
}