import * as React from "react";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {LOGIN_PATH, PROFILE_PATH, REGISTER_PATH, SERVICES_PATH} from "../../config/routes";
import "./Header.css";
import {Button} from "../Button/Button";
import {AdminMenu} from "../AdminMenu/AdminMenu";
import {useAuth} from "../../../Entities/session";
import type {WebsocketStatus} from "../../lib/use-websocket.ts";
import {WebSocketIndicator} from "../WebSocketIndicator/WebSocketIndicator.tsx";

function getLinkClass({isActive}: {isActive: boolean}) {
    return `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
}

interface HeaderProps{
    wsStatus:WebsocketStatus
}

export const Header:React.FC<HeaderProps> = ({wsStatus}) => {
    const {user, logout} = useAuth()
    const isAuth = Boolean(user)
    const isAdmin = user?.role === 'admin'
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate(LOGIN_PATH);
    }

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <span className="site-header__brand">Misha psychologist</span>
                <nav className="site-nav">
                    {!isAuth ? (
                        <>
                            <NavLink className={getLinkClass} to={LOGIN_PATH}>Войти</NavLink>
                            <Link className="button button--primary button--sm" to={REGISTER_PATH}>Регистрация</Link>
                        </>
                    ) : (
                        <>
                            <NavLink className={getLinkClass} to={SERVICES_PATH}>Каталог</NavLink>
                            <NavLink className={getLinkClass} to={PROFILE_PATH}>Профиль</NavLink>
                            {isAdmin && <AdminMenu/>}
                            <WebSocketIndicator status={wsStatus}/>
                            <Button className="site-nav__logout" variant="secondary" size="sm" onClick={handleLogout}>Выйти</Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};