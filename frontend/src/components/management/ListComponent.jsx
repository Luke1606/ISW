import { Suspense } from "react"
import { useParams } from "react-router-dom"
import { Search, Plus, Edit, Trash2, FileText, Check, X } from "lucide-react"
import { useListDataStates, useItemSelectionControl, useListModals, usePermisions } from "../../hooks/management/useList"
import Modal from "../common/Modal"
import PaginationButtons from "../common/PaginationButtons"
import FormComponent from "./Forms/FormComponent"


const List = () => {
    const { datatype, relatedUserId } = useParams()

    const {
        currentData,
        loading,
        paginationParams,
        handleSearch,
        handleDelete
    } = useListDataStates(datatype, relatedUserId)

    const permissions = usePermisions(datatype)

    const {
        itemOptions,
        handleOptions,
        selectedItemId,
        setSelectedItemId
    } = useItemSelectionControl(datatype)

    const {
        openManageForm,
        manageFormParams,
        manageFormModalVisibility,
        deleteConfirmationModalVisibility,
        setdeleteConfirmationModalVisibility,
    } = useListModals()

    return (
        <div className="manage-container">
            {/* Barra de busqueda */}
            <form 
                role="search" 
                className="search-form"
                onSubmit={handleSearch}
                >
                <input
                    className="form-input search-input"
                    type="text"
                    name="search"
                    placeholder="Buscar en Akademos..."
                    />

                <button
                    title="Buscar"
                    type="submit"
                    className="search-button"
                    >
                    <Search size={40}/>
                </button>
            </form>
            
            <div
                className="button-container manage-buttons"
                >
                { permissions.add &&
                    <button 
                        title="Agregar"
                        className="add-button"
                        onClick={() => openManageForm({datatype: datatype})}
                        >
                        <Plus size={40}/>
                    </button>}

                    { permissions.del && 
                        <button 
                            title="Eliminar varios"
                            className="delete-button"
                            onClick={() => setdeleteConfirmationModalVisibility(true)}
                            >
                            <Trash2 size={40}/>
                        </button>}
                </div>

            {/* Lista de elementos */}
            <Suspense
                fallback={<span className="spinner"/>}
                >
                <div
                    className="manage-list"
                    >
                    { loading? 
                    <span className="spinner"/>
                    :
                    currentData?.length > 0?
                        currentData?.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="list-item">
                                <h3 className="list-item-title">
                                    {item.name}
                                </h3>

                                <div className="list-button-container button-container">
                                    <button
                                        title="Ver detalles"
                                        className="details-button list-button"
                                        onClick={() => openManageForm({datatype: datatype, idData: item.id, view: true})}
                                        >
                                        <FileText size={50}/>
                                    </button>

                                    { permissions.edit && 
                                        <button 
                                            title="Editar"
                                            className="edit-button list-button"
                                            onClick={() => openManageForm({datatype: datatype, idData: item.id})}
                                            >
                                            <Edit size={50}/>
                                        </button>}

                                    { permissions.del && 
                                        <button 
                                            title="Eliminar"
                                            className="delete-button list-button"
                                            onClick={() => {
                                                setSelectedItemId(item.id)
                                                setdeleteConfirmationModalVisibility(true)
                                                }}>
                                            <Trash2 size={50}/>
                                        </button>}
                                
                                    <select 
                                        className="button options-button list-button" 
                                        title="Más opciones"
                                        defaultValue={""}
                                        onChange={handleOptions}
                                        onClick={()=>setSelectedItemId(item.id)}
                                        >
                                        <option 
                                            className="option-element" 
                                            value="" 
                                            disabled
                                            >
                                            Seleccione una opción...
                                        </option>

                                        {itemOptions.map((option, index) => (
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
                            No hay elementos que mostrar.
                        </h3>}
                </div>

                <PaginationButtons 
                    paginationParams={paginationParams}/>
            </Suspense>
            
            {/* modal de confirmacion de eliminado */}
            <Modal isOpen={deleteConfirmationModalVisibility}>
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
                            onClick={() => handleDelete(datatype, selectedItemId, relatedUserId)}>
                            <Check size={30}/>
                        </button>
                        
                        <button 
                            className="cancel-button modal-button"
                            title="Cancelar"

                            onClick={() => setdeleteConfirmationModalVisibility(false)}>
                            <X size={30}/>
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={manageFormModalVisibility}>
                <FormComponent formParams={manageFormParams}/>
            </Modal>
        </div>
    )
}

export default List
