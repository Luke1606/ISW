import { useState, useEffect } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import PropTypes from 'prop-types'


const fileIcons = {
    video: 'fas fa-file-video',
    docx: 'fas fa-file-word',
    xlsx: 'fas fa-file-excel',
    zip: 'fas fa-file-archive',
    default: 'fas fa-file'
  };
  
const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase()
    return fileIcons[ext] || fileIcons.default
}

const FilePreviewer = ({ source }) => {
    const [fileType, setFileType] = useState(null)
    const [fileURL, setFileURL] = useState(null)

    useEffect(() => {
        if (source instanceof File) {
            const fileName = source.name.toLowerCase()
            const ext = fileName.split('.').pop()
            const url = URL.createObjectURL(source)
            setFileURL(url)

            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                setFileType('image')
            } else if (ext === 'pdf') {
                setFileType('pdf')
            } else {
                setFileType('other') // Para archivos que no tienen previsualización directa
            }
        }
    }, [source])

    if (!fileType) return null

    return (
        <div className='preview-container'>
            {fileType === 'image' && <img src={fileURL} alt='Vista previa' className='preview-image' />}
            {fileType === 'pdf' && (
                <iframe src={fileURL} width='500px' height='250px' style={{ border: 'none' }}/>
            )}
            <div className='preview-info'>
                {fileType === 'other' && 
                    <span title='Icono de archivo'>
                        <i className={getFileIcon(source.name)}></i>
                    </span>}

                <p className='preview-title'>{source.name}</p>
            </div>
        </div>
    )
}

FilePreviewer.propTypes = {
    source: PropTypes.instanceOf(File).isRequired
}

export default FilePreviewer