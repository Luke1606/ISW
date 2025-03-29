import { Suspense } from "react"
import { useParams } from "react-router-dom"
import useList from "../../hooks/management/useList"
import Modal from "../common/Modal"
import { 
    Search, 
    Save, 
    Edit, 
    Trash2,
    FileText, 
    Check, 
    X,
    ArrowLeftSquare,
    ArrowRightSquare
} from "lucide-react"

const List = () => {
    const { datatype, relatedUserId } = useParams()

    const {
        formik, 
        state, 
        setState,
        permissions, 
        options, 
        handlePageChange, 
        handleDelete, 
        handleOptions, 
        navigate 
    } = useList(datatype, relatedUserId)

    return (
        <div className="manage-container">
            {/* Barra de busqueda */}
            <form 
                role="search" 
                className="search-form"
                onSubmit={formik.handleSubmit}
                >
                <input
                    className="form-input search-input"
                    type="text"
                    placeholder="Buscar en Akademos..."
                    {...formik.getFieldProps("search")}/>

                <button
                    title="Buscar"
                    type="submit"
                    className="search-button"
                    >
                    <Search size={30}/>
                </button>
            </form>
            
            <div
                className="button-container manage-buttons"
                >
                { permissions.add &&
                    <button 
                        title="Agregar"
                        className="add-button"
                        onClick={() => navigate(`/form/${datatype}`)}>
                        <Save size={30}/>
                    </button>}

                    { permissions.del && 
                        <button 
                            title="Eliminar varios"
                            className="delete-button list-button"
                            onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                deleteConfirmationModalVisibility: true
                                }))   
                            }}>
                            <Trash2 size={30}/>
                        </button>}
                </div>

            {/* Lista de elementos */}
            <Suspense
                fallback={<span className="spinner"/>}
                >
                <div
                    className="manage-list"
                    >
                    { state?.data?.[state.currentPage]?.length > 0? state.data[state.currentPage].map((item, index) => (
                        <div key={`${item.id}-${index}`} className="list-item">
                            <h3 className="list-item-title">
                                {item.name}
                            </h3>

                            <div className="list-button-container button-container">
                                { permissions.edit && 
                                    <button 
                                        title="Editar"
                                        className="edit-button list-button"
                                        onClick={() => navigate(`/form/${datatype}/${item.id}`)}>
                                        <Edit size={30}/>
                                    </button>}

                                { permissions.del && 
                                    <button 
                                        title="Eliminar"
                                        className="delete-button list-button"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev, 
                                                selectedItemId: item.id,
                                                deleteConfirmationModalVisibility: true
                                            }))   
                                        }}>
                                        <Trash2 size={30}/>
                                    </button>}

                                <button
                                    title="Ver detalles"
                                    className="details-button list-button"
                                    onClick={() => navigate(`/form/${datatype}/${item.id}/${true}`)}>
                                    <FileText size={30}/>
                                </button>

                                <select 
                                    className="button options-button" 
                                    title="Más opciones"
                                    onChange={handleOptions}
                                    >
                                    <option className="option-element" value="" disabled>Seleccione una opción...</option>
                                    {options.map((option, index) => (
                                        <option
                                            key={index}
                                            className="option-element"
                                            value={option.value}
                                            >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                    : 
                    <h3 className="list-item-title">
                        No hay elementos que mostrar. <br />
                        {/* mensaje de error */}
                        { state.error && 
                        <span className='error'>
                            {state.error.message}
                        </span> }
                    </h3>}
                </div>

                {/* botones de paginado */}
                { state?.totalPages >= 1 && 
                    <div className="button-group pagination-button-group">
                        <button 
                            title="Anterior"
                            onClick={() => handlePageChange(state.currentPage - 1)}
                            disabled={state.currentPage===0}
                            style={
                                state.currentPage===0? 
                                    { visibility: 'hidden' }:{}}
                            >
                            <ArrowLeftSquare size={40}/>
                        </button>

                        <select 
                            title="Ir a página..."
                            onChange={(e) => handlePageChange(Number(e.target.value))}
                            value={state.currentPage}
                            disabled={state.totalPages<=1}
                            className="button"
                            style={
                                state.totalPages<=1?
                                    { visibility: 'hidden' }:{}}
                            >
                            <option value="" disabled>Ir a página...</option>

                            {Array.from({ length: state.totalPages }, (_, index) => (
                                <option key={index} value={index}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>

                        <button 
                            title="Siguiente"
                            onClick={() => handlePageChange(state.currentPage + 1)}
                            disabled={state.currentPage >= state.totalPages - 1}
                            style={
                                state.currentPage >= state.totalPages - 1?
                                    { visibility: 'hidden' }:{}}
                            >
                            <ArrowRightSquare size={40}/>
                        </button>
                    </div>}
            </Suspense>
            
            {/* modal de confirmacion de eliminado */}
            <Modal isOpen={state.deleteConfirmationModalVisibility}>
                <div 
                    className="confirmation-modal"
                    >
                    <h2 className="modal-title">
                        Confirmar eliminación
                    </h2>

                    <p className="modal-content">
                        ¿Está seguro de que desea continuar?
                    </p>

                    <div className="button-container modal-button-container">
                        <button 
                            className="accept-button modal-button"
                            title="Aceptar"
                            onClick={() => handleDelete(datatype, state.selectedItemId, relatedUserId)}>
                            <Check size={30}/>
                        </button>
                        
                        <button 
                            className="cancel-button modal-button"
                            title="Cancelar"

                            onClick={() => setState(
                                (prev) => ({ ...prev, deleteConfirmationModalVisibility: false })
                            )}>
                            <X size={30}/>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default List
