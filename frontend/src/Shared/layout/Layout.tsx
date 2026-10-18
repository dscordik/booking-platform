import * as React from "react";
import {Header} from "../ui/Header.tsx";
import {Outlet} from "react-router-dom";

export const Layout:React.FC = () => {
    return(
        <div>
            <Header/>
            <Outlet/>
        </div>
    )
}