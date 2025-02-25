const Notification = ({ header, content, onClick }) => {
    return (
        <div 
            className="notification" 
            onClick={onClick} 
            style={{
                padding: '10px',
                margin: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
            }}>
                <h3>{ header }</h3>
                <p>{ content }</p>
        </div>
    )
}

export default Notification