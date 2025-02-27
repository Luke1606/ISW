import { useParams } from "react-router-dom"
import List from "../components/List"
import SideMenu from "../components/SideMenu"

const TreePage = () => {
    const { datatype, id } = useParams()
    return (
        <div style={{ display: 'flex' }}>
            <List datatype={datatype} id={id}/>
            <SideMenu />
        </div>
    )
}

export default TreePage