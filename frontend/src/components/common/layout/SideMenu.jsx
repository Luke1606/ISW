import { useSideMenuOptions } from "../../../hooks/useOptions"

const SideMenu = () => {
    const { options, isVisible } = useSideMenuOptions()

    return (
        <aside className={`sidemenu ${isVisible ? 'visible' : 'hidden'}`}>
            <ul className="sidemenu-ul">
                {options.map((option, index) => (
                    <li 
                        key={index}
                        className="sidemenu-li" 
                        onClick={option.action} >
                            {option}
                    </li>
                ))}
            </ul>
        </aside>
    )
}


export default SideMenu