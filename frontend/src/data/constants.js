/**
 * @description Token para demostrar que el usuario tiene acceso a la sesión activa. Dura entre 3 a 5 minutos.
 */
const ACCESS_TOKEN_KEY = 'access'

/**
 * @description Token para renovar el roken de acceso cuando se vence. Dura alrededor de 24 horas.
 */
const REFRESH_TOKEN_KEY = 'refresh'

/**
 * @description Token que contiene la información básica del usuario autenticado, tal como:
 * - Su id asociado
 * - Su nombre completo
 * - Su nombre de usuario
 * - Su rol
 */
const USER_TOKEN_KEY = 'user'

/**
 * @description Constantes a utilizar como `keys` para los tokens a guardar en `localStorage` y 
 * a utilizar para el manejo de sesiones. Contiene:
 * - {@link ACCESS_TOKEN_KEY}
 * - {@link REFRESH_TOKEN_KEY} 
 * - {@link USER_TOKEN_KEY} 
 */
const tokens = { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_TOKEN_KEY }
export default tokens