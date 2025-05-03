import { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SearchableSelect = ({ id, title, elements, defaultValue = { value: '', label: 'Seleccione una opción '} }) => {
    const [ selectedOption, setSelectedOption ] = useState('')
    const [ remainingElements, setRemainingElements ] = useState(elements)

    const handleElementChange = (selected) => {
        setSelectedOption(selected)
        setRemainingElements(elements.filter((element) => element.value !== selected.value))
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
    })
}

export default SearchableSelect