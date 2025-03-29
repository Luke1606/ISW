import { Suspense } from "react"
import { useParams } from "react-router-dom"
import { useList } from "../../hooks/useManagement"
import Modal from "../common/Modal"

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
                    type="submit"
                    className="search-button"
                    >
                    Buscar
                </button>
            </form>
            
            <div
                className="button-container-manage-buttons"
                >
                { permissions.add &&
                    <button 
                        className="add-button"
                        onClick={() => navigate(`/form/${datatype}`)}>
                        Agregar
                    </button>}

                    { permissions.del && 
                        <button 
                            className="delete-button list-button"
                            onClick={() => {
                            setState((prev) => ({
                                ...prev, 
                                deleteConfirmationModalVisibility: true
                                }))   
                            }}>
                            Eliminar
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
                                        className="edit-button list-button"
                                        onClick={() => navigate(`/form/${datatype}/${item.id}`)}>
                                        Editar
                                    </button>}

                                { permissions.del && 
                                    <button 
                                        className="delete-button list-button"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev, 
                                                selectedItemId: item.id,
                                                deleteConfirmationModalVisibility: true
                                            }))   
                                        }}>
                                        Eliminar
                                    </button>}

                                <button
                                    className="details-button list-button"
                                    onClick={() => navigate(`/form/${datatype}/${item.id}/${true}`)}>
                                    Ver detalles
                                </button>

                                <select 
                                    className="button options-button" 
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
                { state?.data?.[state.currentPage]?.length > 0 && <div className="button-group pagination-button-group">
                    <button 
                        onClick={() => handlePageChange(state.currentPage - 1)}
                        disabled={state.currentPage===0}
                        style={
                            state.currentPage===0? 
                                { visibility: 'hidden' }:{}}>
                            Anterior
                    </button>

                    <select 
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        value={state.currentPage}
                        disabled={state.totalPages<=1}
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
                        onClick={() => handlePageChange(state.currentPage + 1)}
                        disabled={state.currentPage >= state.totalPages - 1}
                        style={
                            state.currentPage >= state.totalPages - 1?
                                { visibility: 'hidden' }:{}}
                        >
                        Siguiente
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

                    <div className="modal-button-container button-container">
                        <button 
                            className="accept-button modal-button"
                            onClick={() => handleDelete(datatype, state.selectedItemId, relatedUserId)}>
                            Aceptar
                        </button>
                        
                        <button 
                            className="cancel-button modal-button"
                            onClick={() => setState(
                                (prev) => ({ ...prev, deleteConfirmationModalVisibility: false })
                            )}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default List
