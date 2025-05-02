import { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SearchableSelect = ({ elements }) => {
    const [selectedOption, setSelectedOption] = useState('')
    const [ remainingElements, setRemainingElements ] = useState(elements)

    const handleElementChange = (selected) => {
        setSelectedOption(selected)
        setRemainingElements(elements.filter((element) => element.value !== selected.value))
    }

    const defaultValue = { value: '', label: 'Seleccione una opción '}

    return (
        <Select
            options={remainingElements}
            value={selectedOption}
            defaultValue={defaultValue}
            onChange={handleElementChange}
            placeholder='Seleccione una opción...'
            isSearchable
        />
    )
}

SearchableSelect.propTypes = {
    elements: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }))
}

export default SearchableSelect