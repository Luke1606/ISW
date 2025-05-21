import PropTypes from 'prop-types'

const CheckeableListItem = ({item, children, checked, setSelectedItems}) => {
    const handleChange = () => {
        setSelectedItems((prev) => 
            prev.includes(item.id)?
                prev.filter(id => id !== item.id)  // Si ya está, lo quitamos
                :
                [...prev, item.id]  // Si no está, lo agregamos
        )
    }
    
    return (
        <div 
            className='list-item'
            onClick={handleChange}>
            <div 
                className='list-item-header'
                >
                <input 
                    className='list-checkbox'
                    name='list-item-check'
                    type='checkbox' 
                    checked={checked} 
                    readOnly
                    />

                <h3 
                    className='list-item-title'
                    >
                    {item.name}
                </h3> 
            </div>

            <div onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

CheckeableListItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    children: PropTypes.node.isRequired,
    checked: PropTypes.bool.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
}

export default CheckeableListItem