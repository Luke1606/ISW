import PropTypes from "prop-types"

const Error = ({errorTitle, errorDescription}) => (
    <>
        <h1>{errorTitle}</h1>
        <p>{errorDescription}</p>
    </>)

Error.propTypes = {
    errorTitle: PropTypes.string.isRequired,
    errorDescription: PropTypes.string.isRequired,
}

export default Error