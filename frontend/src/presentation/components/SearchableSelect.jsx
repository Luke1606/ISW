import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
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

    useEffect(() => {
        setRemainingElements(elements)
    }, [elements])

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
        setSelectedOptions(selected || [])
        
        const selectedValues = selected? selected.map(opt => opt.value) : []
        setRemainingElements(elements.filter(element => !selectedValues.includes(element.value)))
    
        if (onChange) {
            onChange(selectedValues)
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

