import PropTypes from 'prop-types'
import { useEffect, useRef, useState, useMemo } from 'react'
import Select from 'react-select'

const SearchableSelect = ({ 
    id, 
    title, 
    elements,
    onChange,
    defaultValue = { value: '', label: 'Seleccione una opción '}
}) => {
    const [ selectedOption, setSelectedOption ] = useState(defaultValue)
    const [ remainingElements, setRemainingElements ] = useState(elements)
    const changedRef = useRef(null)

    useEffect(() => {
        setRemainingElements(elements)
        changedRef.current = null
    }, [elements])

    useEffect(() => {
        if (defaultValue.value !== selectedOption?.value && !changedRef.current) {
                setSelectedOption(defaultValue)
            }
    }, [defaultValue, selectedOption])

    const handleElementChange = (selected) => {
        changedRef.current = true;
        setSelectedOption(selected);
        
        if (!selected) {
            setRemainingElements(elements)
        } else {
            setRemainingElements(elements.filter((element) => element.value !== selected.value))
        }
    
        if (onChange) {
            onChange(selected ? selected.value : '')
        }
    }

    return (
        <Select
            isClearable
            isSearchable
            inputId={id}
            title={title}
            className='form-input'
            value={selectedOption}
            options={remainingElements}
            defaultValue={defaultValue}
            onChange={handleElementChange}
            placeholder='Seleccione una opción...'
            noOptionsMessage={() => 'No hay opciones'}
            />
    )
}

SearchableSelect.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    elements: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    defaultValue: PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
    }),
    onChange: PropTypes.func,
}

export default SearchableSelect

export const MultiSearchableSelect = ({ 
    id='', 
    title='', 
    elements,
    onChange,
    defaultValue = []
}) => {
    const [ selectedOptions, setSelectedOptions ] = useState(defaultValue)
    const [ remainingElements, setRemainingElements ] = useState(elements)

    const SELECT_ALL_OPTION = useMemo(() => { 
        const allSelected =
            elements.length > 0 &&
            elements.every((el) =>
            selectedOptions.some((opt) => opt.value === el.value))

        return {
            value: 'SELECT_ALL', 
            label: allSelected? 'Deseleccionar todo' : 'Seleccionar todo'
        }
    }, [elements, selectedOptions])
    
    const options = useMemo(() => {
        return [SELECT_ALL_OPTION, ...elements]
      }, [elements, SELECT_ALL_OPTION])
    
    useEffect(() => {
        setRemainingElements(options)
    }, [options])

    useEffect(() => {
        const isMissingFromDefault = defaultValue.some(
            value => !elements.some(element => element.value === value.value)
        )
        
        const isMissingFromSelected = selectedOptions.some(
            option => !elements.some(element => element.value === option.value)
        )

        if (((defaultValue.length > 0 && isMissingFromDefault) || 
            (selectedOptions.length > 0 && isMissingFromSelected))) {
            setSelectedOptions(defaultValue || [])
        }
    }, [defaultValue, elements, selectedOptions])

    const handleElementChange = (selected) => {
        selected = selected || []

        // Verificamos si se seleccionó la opción especial de "Seleccionar todo"
        const hasSelectAll = selected.some(
            (option) => option.value === SELECT_ALL_OPTION.value
        )

        if (hasSelectAll) {
            // Calculamos la selección actual sin contar la opción "Seleccionar todo"
            const currentSelection = selected.filter(
              (option) => option.value !== SELECT_ALL_OPTION.value
            )
      
            // Si no se tienen ya todos los elementos seleccionados, seleccionamos todos.
            if (currentSelection.length !== elements.length) {
                setRemainingElements([])
                setSelectedOptions(elements)
                onChange && onChange(elements.map((opt) => opt.value))
            } else {
                // Si ya están todos seleccionados, al pulsar "Seleccionar todo" lo interpretamos como un toggle para deseleccionar todos.
                setSelectedOptions([])
                onChange && onChange([])
            }
        } else {
            // Normalmente actualizamos la selección con lo elegido por el usuario.
            setSelectedOptions(selected)
            onChange && onChange(selected.map((opt) => opt.value))
        }      
    }

    return (
        <Select
            isMulti
            inputId={id}
            isSearchable
            title={title}
            className='form-input'
            value={selectedOptions}
            defaultValue={defaultValue}
            options={remainingElements}
            onChange={handleElementChange}
            placeholder='Seleccione una opción...'
            noOptionsMessage={() => 'No hay opciones'}
        />
    )
}

MultiSearchableSelect.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    elements: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    defaultValue: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    onChange: PropTypes.func,
}

