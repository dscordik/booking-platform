import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../lib/token-storage";
import {LOGIN_PATH, PROFILE_PATH, REGISTER_PATH, SERVICES_PATH} from "../config/routes";

export const Header: React.FC = () => {
    const isAuth = Boolean(getToken());
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate(LOGIN_PATH);
    }

    return (
        <header>
            <span>Misha psychologist</span>
            <nav>
                {!isAuth ? (
                    <>
                        <Link to={LOGIN_PATH}>Войти</Link>
                        <Link to={REGISTER_PATH}>Регистрация</Link>
                    </>
                ) : (
                    <>
                        <Link to={SERVICES_PATH}>Каталог</Link>
                        <Link to={PROFILE_PATH}>Профиль</Link>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                )}
            </nav>
        </header>
    );
};