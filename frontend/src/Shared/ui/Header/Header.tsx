import * as React from "react";
import {Link, useNavigate} from "react-router-dom";
import {removeToken} from "../../lib/token-storage";
import {ADMIN_BOOKINGS_PATH, ADMIN_SERVICES_PATH, ADMIN_SLOTS_PATH, LOGIN_PATH, PROFILE_PATH, REGISTER_PATH, SERVICES_PATH} from "../../config/routes";
import "./Header.css";
import { Button } from "../Button/Button";
import {useAuth} from "../../../Entities/session";

export const Header: React.FC = () => {
    const {user} = useAuth()
    const isAuth = Boolean(user)
    const isAdmin = user?.role === 'admin'
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
                            {isAdmin && (
                                <div>
                                    <Link className="site-nav__link" to={ADMIN_SERVICES_PATH}>Услуги</Link>
                                    <Link className="site-nav__link" to={ADMIN_SLOTS_PATH}>Слоты</Link>
                                    <Link className="site-nav__link" to={ADMIN_BOOKINGS_PATH}>Записи</Link>
                                </div>
                            )}
                            <Button className="site-nav__logout" variant="secondary" size="sm" onClick={handleLogout}>Выйти</Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};