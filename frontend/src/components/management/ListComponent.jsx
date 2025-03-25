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
                onSubmit={formik.handleSubmit}
                >
                <input
                    type="text"
                    placeholder="Buscar en Akademos..."
                    {...formik.getFieldProps("search")}/>

                <button 
                    type="submit"
                    >
                    Buscar
                </button>
            </form>
            
            { permissions.add &&
                <button 
                    className="add-button"
                    onClick={() => navigate(`/form/${datatype}`)}>
                    Agregar
                </button>}

            {/* Lista de elementos */}
            <Suspense 
                fallback={<span className="spinner"/>}
                >
                { state?.data?.[state.currentPage]?.length > 0? state.data[state.currentPage].map((item, index) => (
                    <div key={`${item.id}-${index}`} className="list-item">
                        <h3 className="list-item-title">
                            {item.name}
                        </h3>

                        <div className="list-button-group button-group">
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
                                className="options-button list-button" 
                                onChange={handleOptions}>
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

                {/* botones de paginado */}
                { state?.data?.[state.currentPage]?.length > 0 && <div className="button-group pagination-button-group">
                    <button 
                        onClick={() => handlePageChange(state.currentPage - 1)}
                        disabled={state.currentPage===0}>
                            Anterior
                    </button>

                    <select 
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        value={state.currentPage}
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
                        >
                        Siguiente
                    </button>
                </div>}
            </Suspense>
            
            {/* modal de confirmacion de eliminado */}
            <Modal isOpen={state.deleteConfirmationModalVisibility}>
                <h2 className="modal-title">
                    Confirmar eliminación
                </h2>

                <p className="modal-content">
                    ¿Está seguro de que desea continuar?
                </p>

                <div className="modal-button-group button-group">
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
            </Modal>
        </div>
    )
}

export default List
