const NotFoundPage = ({errorTitle, errorDescription}) => {
    return (
        <>
            <h1>{errorTitle}</h1>
            <p>{errorDescription}</p>
        </>
    )
}

export default NotFoundPage