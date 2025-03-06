import { useParams } from "react"
import { useList } from "../../hooks/useManagement"
import Modal from "../common/Modal"

const List = () => {
    const { datatype, id } = useParams()

    const { formik, state, setState, permissions, options, handlePageChange, handleDelete, handleOptions, navigate } = useList(datatype, id)

    
    return (
        <div>
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
            
            {/* elemento de carga */}
            { state.loading &&
                <span className='spinner'/> }
            
            {/* mensaje de error */}
            { state.error && 
                <span className='error'>
                    Error: {state.error.message}
                </span> }
            
            { permissions.add &&
                <button 
                    className="add-button"
                    onClick={() => navigate(`/form/${datatype}`)}>
                    Agregar
                </button>}

            {/* Lista de elementos */}
            { state.data[state.currentPage].map((item, index) =>  (
                    <div key={item.id} className='list-item'>
                        <h3 className='list-item-title'>
                            {item.name}
                        </h3>

                        <div className='button-group'>
                            { permissions.edit && 
                                <button 
                                    className="edit-button"
                                    onClick={() => navigate(`/form/${datatype}/${index}`)}>
                                    Editar
                                </button>}

                            { permissions.del && 
                                <button 
                                    className="delete-button"
                                    onClick={() => {
                                        setState((prev) => ({
                                            ...prev, 
                                            selectedItemId: index,
                                            deleteConfirmationModalVisibility: true
                                        }))   
                                    }}>
                                    Eliminar
                                </button>}

                            <button
                                className="details-button"
                                onClick={() => navigate(`/form/${datatype}/${index}/${true}`)}>
                                Ver detalles
                            </button>

                            <select 
                                className="options-button" 
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
                )
            )}

            <Modal isOpen={state.deleteConfirmationModalVisibility}>
                <h2 className="modal-title">
                    Confirmar eliminación
                </h2>

                <p className="modal-content">
                    ¿Está seguro de que desea continuar?
                </p>

                <button 
                    className="accept-button"
                    onClick={() => handleDelete(datatype, state.selectedItemId, id)}>
                    Aceptar
                </button>
                
                <button 
                    className="cancel-button"
                    onClick={() => setState(
                        (prev) => ({ ...prev, deleteConfirmationModalVisibility: false })
                    )}>
                    Cancelar
                </button>
            </Modal>

            {/* botones de paginado */}
            <div className='button-group pagination-button-group'>
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
            </div>
        </div>
    )
}

export default List
