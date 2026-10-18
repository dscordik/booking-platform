import {Link, useNavigate} from "react-router-dom";
import {HOME_PATH, LOGIN_PATH} from "../../../Shared/config/routes";
import {RegisterForm} from "../../../Features/auth-by-email/register";
import "./Register.css";

export const RegisterPage = () => {
    const navigate = useNavigate()

    function handleRegisterSuccess() {
        navigate(HOME_PATH)
    }

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <h2>Регистрация</h2>
                <RegisterForm onSuccess={handleRegisterSuccess}/>
                <p className="auth-page__footer">
                    <Link to={LOGIN_PATH}>Уже есть аккаунт? Войти</Link>
                </p>
            </div>
        </div>
    )
}