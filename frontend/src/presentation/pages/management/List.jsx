import PropTypes from 'prop-types'
import { Search, Plus, Edit, Trash2, FileText, Check, X, CheckCheck } from 'lucide-react'
import { listHooks, useFormParams, useModal, useTranslateToSpanish } from '@/logic'
import { Modal, PaginationButtons, Form, CheckeableListItem } from '@/presentation'
import { datatypes } from '@/data'

const List = ({ datatype, relatedUserId }) => {
    const {
        selectAll,
        setChanged,
        currentData,
        handleSearch,
        handleDelete,
        errorMessage,
        selectedItems,
        setSelectedItems,
        paginationParams
    } = listHooks.useListDataStates(datatype, relatedUserId)
    
    const permissions = listHooks.usePermisions(datatype)

    const {
        itemOptions,
        setSelectedItemId,
        handleOptionChange
    } = listHooks.useItemTouchControl(datatype)

    const deleteModalId = 'delete-modal'

    const { isOpen, openModal, closeModal } = useModal()
    
    const { openManageForm, isManageFormOpen } = useFormParams()
    
    const translate = useTranslateToSpanish()
    const spanishDatatype = translate(datatype).toLowerCase()

    return (
        <div 
            className='manage-container'
            >
            <h2 
                className='list-title'
                >
                {(permissions.add && permissions.del && permissions.edit)?
                    'Gestionar'
                    :
                    'Listar'    
                } {`${spanishDatatype}${['a', 'e', 'i', 'o', 'u'].includes(spanishDatatype.slice(-1).toLowerCase()) ? 's' : 'es'}`}
            </h2>
            
            {/* Barra de busqueda */}
            <form 
                role='search' 
                className='search-form'
                onSubmit={handleSearch}
                >
                <input
                    className='form-input search-input'
                    type='text'
                    name='search'
                    placeholder='Buscar en Akademos...'
                    />

                <button
                    title='Buscar'
                    type='submit'
                    className='search-button'
                    >
                    <Search size={40}/>
                </button>
            </form>
            
            <div
                className='button-container manage-buttons'
                >
                { permissions?.add && 
                    <button 
                        title='Agregar' 
                        className={`add-button ${selectedItems.length > 1 && 'hidden'}`}
                        onClick={() => openManageForm(datatype, { relatedUserId })}
                        >
                        <Plus size={40}/>
                    </button>}

                    { permissions?.del &&
                        <>
                            <button
                                title='Seleccionar todos de esta página'
                                className='accept-button'
                                onClick={() => selectAll()}
                                >
                                <Check size={40}/>
                            </button>

                            <button
                                title='Seleccionar todos'
                                className='accept-button'
                                onClick={()=> selectAll(true)}
                                >
                                <CheckCheck size={40}/>
                            </button>

                            <button 
                                title='Eliminar varios'
                                className={`delete-button ${selectedItems.length <= 1 && 'hidden'}`}
                                onClick={() => openModal(deleteModalId)}
                                >
                                <Trash2 size={40}/>
                            </button>
                        </>
                        }
                </div>

            {/* Lista de elementos */}
            <div
                className='manage-list'
                >
                { errorMessage && 
                    <span 
                        className='error'
                        >
                        {errorMessage}
                    </span> }

                { currentData?.length > 0?
                    currentData?.map((item, index) => (
                        <CheckeableListItem 
                            key={`${item.id}-${index}`} 
                            item={item}
                            checked={selectedItems.includes(item.id)}
                            setSelectedItems={setSelectedItems}
                            >
                            <div className='list-button-container button-container'>
                                <button
                                    title='Ver detalles'
                                    className='details-button list-button'
                                    onClick={() => openManageForm(datatype, { idData: item.id, view: true })}
                                    >
                                    <FileText size={50}/>
                                </button>

                                { permissions?.edit &&
                                    <button 
                                        title='Editar'
                                        className={`edit-button list-button ${selectedItems.length > 1 && 'hidden'}`}
                                        onClick={() => openManageForm(datatype, { idData: item.id })}
                                        >
                                        <Edit size={50}/>
                                    </button>}

                                { permissions?.del &&
                                    <button 
                                        title='Eliminar'
                                        className={`delete-button list-button ${selectedItems.length > 1 && 'hidden'}`}
                                        onClick={() => {
                                            setSelectedItems([item.id])
                                            openModal(deleteModalId)
                                        }}
                                        >
                                        <Trash2 size={50}/>
                                    </button>}
                            
                                { datatype === datatypes.user.student &&
                                    <select 
                                        className={`button options-button list-button ${selectedItems.length > 1 && 'hidden'}`}
                                        name='options'
                                        title='Más opciones'
                                        defaultValue={'default'}
                                        onChange={(e) => {
                                            handleOptionChange(e)
                                            setChanged(true)
                                        }}
                                        onClick={() => setSelectedItemId(item.id)}
                                        >
                                        <option 
                                            className='option-element' 
                                            value='default' 
                                            disabled
                                            >
                                            -- Seleccione una opción --
                                        </option>

                                        {itemOptions.map((option, index) => (
                                            <option
                                                key={index}
                                                className='option-element'
                                                value={option.value}
                                                >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>}
                            </div>
                        </CheckeableListItem>
                    ))
                : 
                <h3 className='list-item-title'>
                    No hay elementos que mostrar.
                </h3>}
            </div>

            <PaginationButtons paginationParams={paginationParams} optionalButtonClassName='list-pagination-button'/>
            
            {/* modal de confirmacion de eliminado */}
            <Modal isOpen={isOpen(deleteModalId)}>
                <div 
                    className='confirmation-modal'
                    >
                    <h2 className='modal-title'>
                        Confirmar eliminación de {spanishDatatype}
                    </h2>

                    <p className='modal-content'>
                        ¿Está seguro de que desea eliminar 
                        {selectedItems.length > 1?
                            ' los elementos seleccionados' 
                            : 
                            ' el elemento seleccionado'}?
                    </p>

                    <div className='button-container modal-button-container'>
                        <button 
                            className='accept-button modal-button'
                            title='Aceptar'
                            onClick={() => {
                                handleDelete(datatype, selectedItems, relatedUserId)
                                closeModal(deleteModalId)   
                            }}>
                            <Check size={30}/>
                        </button>
                        
                        <button 
                            className='cancel-button modal-button'
                            title='Cancelar'

                            onClick={() => closeModal(deleteModalId)}>
                            <X size={30}/>
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isManageFormOpen()}>
                <Form reloadFunction={setChanged}/>
            </Modal>
        </div>
    )
}

List.propTypes = {
    datatype: PropTypes.string.isRequired,
    relatedUserId: PropTypes.string,
}

export default List
