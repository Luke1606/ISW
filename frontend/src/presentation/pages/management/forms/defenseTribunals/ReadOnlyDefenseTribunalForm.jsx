const ReadOnlyDefenseTribunalForm = ({ values = {} }) => {
    return (
        <form
            className='form-container manage-form'
            onSubmit={() => null}
        >
            <label className="form-label">
                Fecha de defensa:
            </label>
            <input
                className="form-input"
                type="text"
                value={values.date || ""}
                readOnly
            />

            <label className="form-label">
                Presidente del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={values.president || ""}
                readOnly
            />

            <label className="form-label">
                Secretario del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={values.secretary || ""}
                readOnly
            />

            <label className="form-label">
                Vocal del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={values.vocal || ""}
                readOnly
            />

            <label className="form-label">
                Suplente del tribunal:
            </label>
            <input
                className="form-input"
                type="text"
                value={values.substitute || ""}
                readOnly
            />

            <button
                className='accept-button'
                type='button'
                onClick={() => window.history.back()}
            >
                Volver
            </button>
        </form>
    );
}

export default ReadOnlyDefenseTribunalForm