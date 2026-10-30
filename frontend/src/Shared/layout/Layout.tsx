import * as React from "react";
import {Header} from "../ui/Header/Header";
import {Outlet} from "react-router-dom";
import "./Layout.css";
import {useWebsocket} from "../lib/use-websocket.ts";
import {useAuth} from "../../Entities/session";

export const Layout: React.FC = () => {
    const {user} = useAuth()
    const {status} = useWebsocket(user?.id)

    return (
        <div className="app-shell">
            <Header wsStatus={status}/>
            <main className="app-shell__content">
                <Outlet/>
            </main>
        </div>
    )
}