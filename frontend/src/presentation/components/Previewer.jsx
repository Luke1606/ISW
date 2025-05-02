import { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import { getClass } from 'file-icons-js'
import PropTypes from 'prop-types'

const Previewer = ({ source }) => {
    const [fileType, setFileType] = useState(null)
    const [fileURL, setFileURL] = useState(null)

    useEffect(() => {
        if (source instanceof File) {
            const fileName = source.name.toLowerCase()
            const ext = fileName.split('.').pop()
            const url = URL.createObjectURL(source)
            setFileURL(url);

            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                setFileType('image')
            } else if (ext === 'pdf') {
                setFileType('pdf')
            } else {
                setFileType('other') // Para archivos que no tienen previsualización directa
            }
        }
    }, [source]);

    if (!fileType) return null;

    return (
        <div className='preview-container'>
            {fileType === 'image' && <img src={fileURL} alt='Vista previa' className='preview-image' />}
            {fileType === 'pdf' && (
                <Document file={fileURL}>
                    <Page pageNumber={1} />
                </Document>
            )}
            <div className='preview-info'>
                {fileType === 'other' && (
                    <img src={getClass(source.name)} alt='Icono de archivo' className='preview-icon' />
                )}
                <p className='preview-title'>{source.name}</p>
            </div>
        </div>
    );
};

Previewer.propTypes = {
    source: PropTypes.instanceOf(File).isRequired
}

export default Previewer