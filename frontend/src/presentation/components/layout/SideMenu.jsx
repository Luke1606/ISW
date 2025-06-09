import { useSideMenuOptions } from '@/logic'

/**
 * @description `SideMenu` de la aplicación que contiene opciones obtenidas de {@link useSideMenuOptions}.
 * Este solo se muestra si el usuario se encuentra en la url `/list` y las opciones dependen del rol del usuario autenticado.
 * @returns Estructura del `SideMenu` de la aplicación con las opciones correspondientes al usuario autenticado.
 */
const SideMenu = () => {
    const { options, isVisible } = useSideMenuOptions()

    return (
        <aside 
            className={`sidemenu sidemenu-${isVisible? 'visible' : 'hidden'}`}
            >
            <ul 
                className='sidemenu-ul'
                >
                {options && 
                    options.map((option, index) => (
                        <li 
                            key={index}
                            className='sidemenu-li' 
                            onClick={option.action} 
                            >
                            <option.icon 
                                size={50} 
                                color='white'
                                />
                            <span>{option.title}</span>
                        </li>
                    ))}
            </ul>
        </aside>
    )
}


export default SideMenu