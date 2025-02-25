import PropTypes from "prop-types"
// import { useContext } from "react"
// import { AuthContext } from "./AuthProvider"
const style = {
    position : "fixed",
    right : "0",
    margin : "10px auto",
    padding : "60px 0",
    height : "80%",
    width : "20%",
    background : "rgb(230,230,230)",
    
}

const SideMenu = () => {
    // const { user } = useContext(AuthContext)
    let children
    // if(user.availableOptions){
    //     children = Object.values(user.availableOptions).map((option) => {
    //         return (
    //             <li key={option.id}>
    //                 <a href={option.action}>{option.title}</a> 
    //             </li>
    //         )
    //     })
    // }else
        children = <li>No hay opciones disponibles</li>
    return (
        <aside style={style}>
            <ul>
                {children}
            </ul>
        </aside>
    )
}

export default SideMenu

SideMenu.propTypes = {
    children: PropTypes.node,
}