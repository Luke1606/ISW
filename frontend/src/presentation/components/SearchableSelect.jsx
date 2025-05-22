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
    }, [elements])

    useEffect(() => {
        if (defaultValue.value !== selectedOption.value && !changedRef.current)
            setSelectedOption(defaultValue)
    }, [defaultValue, selectedOption])

    const handleElementChange = (selected) => {
        changedRef.current = true
        setSelectedOption(selected)
        setRemainingElements(elements.filter((element) => element.value !== selected.value))

        if (onChange) {
            onChange(selected.value)
        }
    }

    return (
        <Select
            className='form-input'
            inputId={id}
            title={title}
            options={remainingElements}
            value={selectedOption}
            defaultValue={defaultValue}
            onChange={handleElementChange}
            placeholder='Seleccione una opción...'
            isSearchable
            noOptionsMessage={() => 'No se encontraron coincidencias'}
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