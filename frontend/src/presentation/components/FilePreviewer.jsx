import { useState, useEffect, useRef } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import PropTypes from 'prop-types'


const fileIcons = {
    'video/mp4': 'fas fa-file-video',
    'video/x-matroska': 'fas fa-file-video',
    'video/x-msvideo': 'fas fa-file-video',
    'video/mpeg': 'fas fa-file-video',
    'video/x-flv': 'fas fa-file-video',
    'application/msword': 'fas fa-file-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fas fa-file-word',
    'application/vnd.ms-excel': 'fas fa-file-excel',
    'application/zip': 'fas fa-file-archive',
    'application/x-rar-compressed': 'fas fa-file-archive',
    'default': 'fas fa-file'
}
  
const getFileIcon = (mimeType) => {
    return fileIcons[mimeType] || fileIcons.default
}

const FilePreviewer = ({ source }) => {
    const [fileType, setFileType] = useState(null)
    const [fileURL, setFileURL] = useState(null)
    const [mimeType, setMimeType] = useState('')
    const downloadRef = useRef(null)


    useEffect(() => {
        if (source instanceof File) {
            const url = URL.createObjectURL(source)
            setFileURL(url)
            setMimeType(source.type)

            if (source.type.startsWith('image/')) {
                setFileType('image')
            } else if (source.type === 'application/pdf') {
                setFileType('pdf')
            } else {
                setFileType('other') // Para archivos sin previsualización
            }
        }
    }, [source])

    if (!fileType) return null

    const openFullscreen = () => {
        if (fileType === 'image' || fileType === 'pdf') {
            window.open(fileURL, '_blank');
        }
    }

    return (
        <div 
            className='preview-container'
            >
            {fileType === 'image' && 
                <img 
                    src={fileURL} 
                    alt='Vista previa' 
                    className='preview-image' 
                    />}

            {fileType === 'pdf' &&
                <iframe 
                    src={fileURL} 
                    width='450px' 
                    height='250px' 
                    style={{ border: 'none' }}
                    />}

            {fileType === 'other' &&
                <i 
                    title='Icono de archivo' 
                    className={`${getFileIcon(mimeType)} preview-icon`}
                    />}

            <p 
                className='preview-title'
                >
                {source.name}
            </p>

            <div 
                className='button-container preview-button-container'
                >
                {(fileType === 'image' || fileType === 'pdf') && (
                    <button 
                        title='Abrir en pantalla completa en otra pestaña'
                        type='button'
                        className='accept-button fullscreen-button' 
                        onClick={openFullscreen}
                        >
                        <i className='fas fa-expand'/> 
                    </button>)}

                <button 
                    title='Descargar'
                    type='button'
                    className='accept-button download-button' 
                    onClick={() => downloadRef.current.click()} // Activa el enlace oculto
                    >
                    <i className='fas fa-download'/> 
                </button>

                {/* Enlace oculto solo para activar la descarga */}
                <a 
                    href={fileURL} 
                    download={source.name} 
                    ref={downloadRef} 
                    style={{ display: 'none' }}
                    />
            </div>
        </div>
    )
}

FilePreviewer.propTypes = {
    source: PropTypes.instanceOf(File).isRequired
}

export default FilePreviewer