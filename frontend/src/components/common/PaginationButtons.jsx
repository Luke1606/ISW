// Importación de PropTypes para validar los tipos de propiedades y de iconos de navegación de lucide-react
import PropTypes from "prop-types";
import { ArrowLeftSquare, ArrowRightSquare } from "lucide-react";

/**
 * PaginationButtons - Componente de botones de paginación con soporte para bucle y control de página.
 * @param {Object} props - Props del componente.
 * @param {Object} props.paginationParams - Parámetros de configuración de la paginación.
 * @param {string} props.optionalButtonClassName - Clase CSS opcional para los botones.
 */
const PaginationButtons = ({ paginationParams, optionalButtonClassName = "" }) => {
  // Total de páginas del carrusel
    const totalPages = paginationParams.totalPages;
  // Página actual, con un valor predeterminado de 0
    const currentPage = paginationParams.currentPage || 0;
  // Control para mostrar el selector de página (por defecto falso)
    const pageControl = paginationParams.pageControl || false;
  // Opción para habilitar el bucle en la paginación
    const loop = paginationParams.loop || false;

    /**
    * handlePageChange - Maneja el cambio de página con soporte para bucle.
    * @param {number} newPage - Índice de la nueva página.
    */
    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage > totalPages - 1) {
        // Si el índice está fuera de rango y el bucle está habilitado
        if (loop) {
            newPage = newPage < 0 ? totalPages - 1 : 0;
            paginationParams.handlePageChange(newPage);
        }
        }
        paginationParams.handlePageChange(newPage);
    };

    return (
        <div className="button-group pagination-button-group">
        {/* Botón para ir a la página anterior */}
        <button
            title="Anterior"
            className={optionalButtonClassName}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!loop && currentPage === 0} // Desactiva el botón si está en la primera página y el bucle no está habilitado
            style={!loop && currentPage === 0 ? { visibility: "hidden" } : {}}
        >
        <ArrowLeftSquare size={40} />
        </button>

        {/* Selector para controlar la página actual (opcional) */}
        {pageControl && (
            <select
            title="Ir a página..."
            onChange={(e) => handlePageChange(Number(e.target.value))}
            value={currentPage}
            disabled={totalPages <= 1}
            className={`button ${optionalButtonClassName}`}
            style={totalPages <= 1 ? { visibility: "hidden" } : {}}
            >
            <option value="" disabled>
                Ir a página...
            </option>
            {Array.from({ length: totalPages }, (_, index) => (
                <option key={index} value={index}>
                {index + 1}
                </option>
            ))}
            </select>
        )}

        {/* Botón para ir a la página siguiente */}
        <button
            title="Siguiente"
            className={optionalButtonClassName}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!loop && currentPage >= totalPages - 1} // Desactiva si está en la última página y el bucle no está habilitado
            style={!loop && currentPage >= totalPages - 1 ? { visibility: "hidden" } : {}}
        >
            <ArrowRightSquare size={40} />
        </button>
        </div>
    );
};

// Validación de los tipos de propiedades esperadas
PaginationButtons.propTypes = {
    paginationParams: PropTypes.shape({
        totalPages: PropTypes.number.isRequired, // Total de páginas
        currentPage: PropTypes.number, // Página actual
        handlePageChange: PropTypes.func.isRequired, // Función para cambiar de página
        pageControl: PropTypes.bool, // Mostrar o no el control de selección de página
        loop: PropTypes.bool, // Habilitar bucle o no
    }),
  optionalButtonClassName: PropTypes.string, // Clase CSS opcional
};

// Exportación del componente
export default PaginationButtons;