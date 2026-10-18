import {Link, useNavigate} from "react-router-dom"
import {HOME_PATH, REGISTER_PATH} from "../../../Shared/config/routes";
import {LoginForm} from "../../../Features/auth-by-email/login";
import "./LoginPage.css";

export const LoginPage = () => {
    const navigate = useNavigate()

    function handleLoginSuccess() {
        navigate(HOME_PATH)
    }

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <h2>Вход</h2>
                <LoginForm onSuccess={handleLoginSuccess}/>
                <p className="auth-page__footer">
                    <Link to={REGISTER_PATH}>Нет аккаунта? Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    )
}