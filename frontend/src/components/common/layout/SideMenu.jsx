import useSideMenuOptions from "../../../hooks/options/useSideMenuOptions"

const SideMenu = () => {
    const { options, isVisible } = useSideMenuOptions()

    return (
        <aside className={`sidemenu sidemenu-${isVisible ?'visible':'hidden'}`}>
            <ul className="sidemenu-ul">
                {options && options.map((option, index) => (
                    <li 
                        key={index}
                        className="sidemenu-li" 
                        onClick={option.action} 
                        >
                        <option.icon size={50} color="white"/>
                        <span>{option.title}</span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}


export default SideMenu