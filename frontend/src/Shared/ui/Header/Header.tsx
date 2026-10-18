import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../lib/token-storage";
import {LOGIN_PATH, PROFILE_PATH, REGISTER_PATH, SERVICES_PATH} from "../../config/routes";
import "./Header.css";

export const Header: React.FC = () => {
    const isAuth = Boolean(getToken());
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate(LOGIN_PATH);
    }

    return (
        <header className="site-header">
            <span className="site-header__brand">Misha psychologist</span>
            <nav className="site-nav">
                {!isAuth ? (
                    <div>
                        <Link to={LOGIN_PATH}>Войти</Link>
                        <Link to={REGISTER_PATH}>Регистрация</Link>
                    </div>
                ) : (
                    <div>
                        <Link to={SERVICES_PATH}>Каталог</Link>
                        <Link to={PROFILE_PATH}>Профиль</Link>
                        <button className="site-nav__logout" onClick={handleLogout}>Выйти</button>
                    </div>
                )}
            </nav>
        </header>
    );
};