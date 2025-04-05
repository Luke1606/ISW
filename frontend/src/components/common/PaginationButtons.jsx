import PropTypes from "prop-types"
import { ArrowLeftSquare, ArrowRightSquare } from "lucide-react"

const PaginationButtons = ({paginationParams, optionalButtonClassName = ""}) => {
    const totalPages = paginationParams.totalPages
    const currentPage = paginationParams.currentPage || 0
    const pageControl = paginationParams.pageControl || false
    const loop = paginationParams.loop || false

    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage > totalPages-1) {
            if (loop){
                newPage = newPage < 0? totalPages-1 : 0
                paginationParams.handlePageChange(newPage)
            }
        }
        paginationParams.handlePageChange(newPage)
    }

    return (
        <div className="button-group pagination-button-group">
            <button 
                title="Anterior"
                className={optionalButtonClassName}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!loop && currentPage===0}
                style={
                    !loop && currentPage===0? 
                        { visibility: 'hidden' }:{}}
                >
                <ArrowLeftSquare size={40}/>
            </button>

            { pageControl &&
                <select 
                    title="Ir a página..."
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    value={currentPage}
                    disabled={totalPages<=1}
                    className={`button ${optionalButtonClassName}`}
                    style={
                        totalPages<=1?
                            { visibility: 'hidden' }:{}}
                    >
                    <option value="" disabled>Ir a página...</option>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index} value={index}>
                            {index + 1}
                        </option>
                    ))}
                </select>}

            <button 
                title="Siguiente"
                className={optionalButtonClassName}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!loop && currentPage >= totalPages - 1}
                style={
                    !loop && currentPage >= totalPages - 1?
                        { visibility: 'hidden' }:{}}
                >
                <ArrowRightSquare size={40}/>
            </button>
        </div>
    )
}

PaginationButtons.propTypes = {
    paginationParams: PropTypes.shape({
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number,
        handlePageChange: PropTypes.func.isRequired,
        pageControl: PropTypes.bool,
        loop: PropTypes.bool,
    }),
    optionalButtonClassName: PropTypes.string,
}

export default PaginationButtons