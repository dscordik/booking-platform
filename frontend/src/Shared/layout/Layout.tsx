import * as React from "react";
import {Header} from "../ui/Header/Header.tsx";
import {Outlet} from "react-router-dom";
import "./Layout.css";

export const Layout: React.FC = () => {
    return (
        <div className="app-shell">
            <Header/>
            <main className="app-shell__content">
                <Outlet/>
            </main>
        </div>
    )
}