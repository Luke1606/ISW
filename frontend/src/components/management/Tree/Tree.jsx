import { useState, useContext, useEffect, useParams } from "react"
import { Link } from "react-router-dom"
import { getAllData, getData, deleteData } from "../../../API"
import { AuthContext } from "../../login/components/contexts/AuthProvider"
import { BaseButton, CustomButton } from "../../general_components/Buttons"
import { ConfirmModal } from "../../general_components/Modal"
import LoadingSpinner from "../../general_components/Spinner"
import datatypes from "../../general_components/Datatypes"

const List = () => {
    const { datatype, id } = useParams()
    const [ data, setData ] = useState([])
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ 
        isModalOpen, setModalOpen,
        showMoreOptions, setShowMoreOptions, 
        loading, setLoading 
    ] = useState(false)
    const [ 
        selectedItemId, setSelectedItemId,
        index, setIndex 
    ] = useState(0)
    const { user, permissions } = useContext(AuthContext)

    useEffect(() => {
        fetchData()
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await getAllData(datatype, id)    
            setData(response.data)
        } catch (error) {
            console.log(error)
        }finally{   
            setLoading(false)
        }
    }

    const rawData = data? Object.values(data) : null

    let items = []
    
    if (rawData && rawData.length > 0) {
        const itemsPerPage = 10;
    
        const rawItems = Array.from({ length: Math.ceil(rawData.length / itemsPerPage) }, (_, rowIndex) => {
            return rawData.slice(rowIndex * itemsPerPage, (rowIndex + 1) * itemsPerPage);
        });
    
        items = rawItems
                        .filter((item) => { item.name.toLowerCase().includes(searchTerm.toLowerCase()) }) //aun solo busca por el nombre
                        .map((itemGroup, rowIndex) => {
                            return (
                                <ul key={rowIndex}>
                                    {itemGroup.map((item) => (
                                        <li style={styles.li} key={item.id}>
                                            {item.name}
                                            <div style={styles.buttonGroup}>
                                                {permissions.edit && 
                                                    <BaseButton styles={styles.edit} onClick={() => setSelectedItemId(item.id)}>
                                                        <Link to='/form'
                                                            id={item.id}
                                                            datatype={datatype}
                                                            onSubmit={fetchData}>
                                                            Editar
                                                        </Link>
                                                    </BaseButton> }

                                                {permissions.del && <BaseButton styles={styles.delete} onClick={() => { setModalOpen(true) }}>Eliminar</BaseButton>}
                                                
                                                <BaseButton onClick={() => setSelectedItemId(item.id)}>
                                                    <Link
                                                        to="/form"
                                                        id={selectedItemId}
                                                        readOnly={true}
                                                        >
                                                        Ver detalles
                                                    </Link>
                                                </BaseButton>

                                                { datatype==datatypes.student && <BaseButton onClick={() => {setShowMoreOptions(true)}}>Opciones</BaseButton> }
                                                { datatype==datatypes.student && showMoreOptions && 
                                                    <div style={styles.options}>
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to="/tree"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.evidence}>
                                                                    Listar Evidencias
                                                                </Link>
                                                            </li>

                                                            { user.type == 'dpto inf' && hasPendingRequests(selectedItemId) &&
                                                            <li>
                                                                <Link 
                                                                    to="/form"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.request}>
                                                                    Aprobar solicitud
                                                                </Link>
                                                            </li>}

                                                            { user.type == 'dpto inf' && hasUnconfiguredDefenseTribunal(selectedItemId) &&
                                                            <li>
                                                                <Link
                                                                    to="/form"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.defense_tribunal}>
                                                                    Configurar defensa y tribunal
                                                                </Link>
                                                            </li>}

                                                            { user.type != 'dpto inf' && !hasUnconfiguredDefenseTribunal(selectedItemId) &&
                                                            <li>
                                                                <Link
                                                                    to="/form"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.defense_tribunal}
                                                                    readOnly={true}>
                                                                    Ver datos de defensa y tribunal
                                                                </Link>
                                                            </li>}

                                                            { user.type == 'decano' && hasPendingTribunal(selectedItemId) &&
                                                            <li>
                                                                <Link
                                                                    to="/form"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.tribunal}>
                                                                    Aprobar tribunal
                                                                </Link>
                                                            </li>}

                                                            { user.type != 'tribunal' &&
                                                            <li>
                                                                <Link
                                                                    to="/tree"
                                                                    id={selectedItemId}
                                                                    datatype={datatypes.defense_act}>
                                                                    Listar actas de defensa
                                                                </Link>
                                                            </li>}

                                                            { user.type == 'tribunal' &&
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
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )
        })
    } else {
        items = [<li key="no-items"> No hay elementos que mostrar. </li>]
    }

    const handleDelete = async (id, datatype) => {
        await deleteData(datatype, id)
        fetchData()
        setModalOpen(false)
    }

    const handleIndexClick = (index) => {
        setIndex(index)
    }

    const indexButtons = Array.from({ length : items.length }, (_, idx) => {
        return (
            <li key={idx}>
                <button
                    style={styles.button}
                    onClick={() => handleIndexClick(idx)}> {idx + 1} </button>
            </li>
        )
    })

    return (
        <div style={styles.container}>            
            <button style={styles.add} > 
                <Link to='../pages/Form'
                    datatype={datatype}
                    onSubmit={fetchData}>
                    Agregar
                </Link> 
            </button>

            <div role="search" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '10px',
                                backgroundColor: 'rgb(230, 230, 230,.3)',
                                padding:'10px' }}>
                <input type="text" placeholder="Buscar en Akademos..." onChange={(e) => { setSearchTerm(e.target.value) }}/>
            </div>
            <div style={styles.listContainer}>
                <ul style={styles.ul}>
                    {items[index]}
                </ul>
            </div>
            
            <ul style={styles.buttonGroup}>
                {index > 0 &&
                    <li>
                        <button 
                            style={styles.button}
                            onClick={() => handleIndexClick(index - 1)}> Anterior </button>
                    </li>}

                {indexButtons}

                {index < (items.length - 1) &&
                    <li>
                        <CustomButton 
                            customStyles={styles.button}
                            onClick={() => handleIndexClick(index + 1)}> Siguiente </CustomButton>
                    </li>}
            </ul>
            
            {loading && <LoadingSpinner>Loading...</LoadingSpinner>}

            <ConfirmModal isOpen={isModalOpen} onConfirm={handleDelete} onClose={ history.back() }></ConfirmModal>
        </div>
    )
}

export default List

const hasPendingRequests = (studentId) => {
    return getData(`/solicitud_pendiente/${studentId}`).data
}

const hasUnconfiguredDefenseTribunal = (studentId) => {
    return getData(`/defensa_tribunal_sin_configurar/${studentId}`).data
}

const hasPendingTribunal = (studentId) => {
    return getData(`/tribunal_pendiente/${studentId}`).data
}


const styles = {
    container: {
        width: '75%',
        margin: '60px',
        padding: '20px auto',
    },
    listContainer: {
        background: "rgba(230, 230, 230, 0.9)",
        height: '70%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '10px',
    },
    ul: {
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    li: {
        padding: '3px',
        listStyleType: 'none',
        borderBottom: '1px solid #ddd',
        transition: 'background-color 0.3s',
        flex: '1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonGroup: {
        listStyleType: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex',
        justifyContent: 'flex-end',  
        gap: '10px', 
    },
    button: {
        padding: '10px 15px', 
        backgroundColor: 'rgb(235, 157, 41)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        transition: 'background-color 0.3s',
    },
}