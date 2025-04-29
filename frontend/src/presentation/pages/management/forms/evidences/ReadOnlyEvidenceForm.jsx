const ReadOnlyEvidenceForm = ({ prevValues = {} }) => {
    if (!prevValues.user) return null;

    return (
        <form
            className='form-container manage-form'
            onSubmit={() => null}
        >
            <label className='form-label' htmlFor='name'>
                Nombre de la evidencia:
            </label>
            
            <input
                className='form-input'
                id='name'
                type='text'
                value={prevValues.name || ''}
                readOnly
            />

            <label className='form-label' htmlFor='description'>
                Descripción:
            </label>
            
            <textarea
                className='form-input'
                id='description'
                rows='4'
                value={prevValues.description || ''}
                readOnly
            />

            <label className='form-label'>
                Tipo de adjunto:
            </label>
            
            <input
                className='form-input'
                type='text'
                value={prevValues.isUrl ? 'URL Externa' : 'Archivo Local'}
                readOnly
            />

            <label className='form-label'>
                Adjunto:
            </label>
            
            {prevValues.isUrl ? (
                <a
                    className='form-input attachment-link'
                    href={prevValues.adjunto}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {prevValues.adjunto}
                </a>
            ) : (
                <input
                    className='form-input'
                    type='text'
                    value={prevValues.adjunto?.name || 'Archivo cargado'}
                    readOnly
                />
            )}

            <button
                className='accept-button'
                type='button'
                onClick={() => navigate(-1)}
            >
                Volver
            </button>
        </form>
    );
};

export default ReadOnlyEvidenceForm