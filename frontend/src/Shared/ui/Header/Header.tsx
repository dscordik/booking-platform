import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../lib/token-storage";
import {LOGIN_PATH, PROFILE_PATH, REGISTER_PATH, SERVICES_PATH} from "../../config/routes";
import "./Header.css";
import { Button } from "../Button/Button";

export const Header: React.FC = () => {
    const isAuth = Boolean(getToken());
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate(LOGIN_PATH);
    }

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <span className="site-header__brand">Misha psychologist</span>
                <nav className="site-nav">
                    {!isAuth ? (
                        <div>
                            <Link className="site-nav__link" to={LOGIN_PATH}>Войти</Link>
                            <Link className="button button--primary button--sm" to={REGISTER_PATH}>Регистрация</Link>
                        </div>
                    ) : (
                        <div>
                            <Link className="site-nav__link" to={SERVICES_PATH}>Каталог</Link>
                            <Link className="site-nav__link" to={PROFILE_PATH}>Профиль</Link>
                            <Button className="site-nav__logout" variant="secondary" size="sm" onClick={handleLogout}>Выйти</Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};