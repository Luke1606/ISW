import PropTypes from 'prop-types'
import { ArrowLeftSquare, ArrowRightSquare } from 'lucide-react'

const PaginationButtons = ({paginationParams, optionalButtonClassName = ''}) => {
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
        <div className='button-container pagination-button-container'>
            <button 
                title='Anterior'
                className={`${optionalButtonClassName} ${!loop && currentPage===0 && 'hidden'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!loop && currentPage===0}
                >
                <ArrowLeftSquare size={40}/>
            </button>

            { pageControl &&
                <select 
                    name='page-control'
                    title="Ir a página..."
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    value={currentPage}
                    disabled={totalPages<=1}
                    className={`button ${optionalButtonClassName} ${totalPages<=1 && 'hidden'}`}
                    >
                    <option value='' disabled>Ir a página...</option>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index} value={index}>
                            {index + 1}
                        </option>
                    ))}
                </select>}

            <button 
                title='Siguiente'
                className={`${optionalButtonClassName} ${!loop && currentPage >= totalPages - 1 && 'hidden'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!loop && currentPage >= totalPages - 1}
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