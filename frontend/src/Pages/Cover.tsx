import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";

const Cover=()=>{
    return(
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}
export default Cover;