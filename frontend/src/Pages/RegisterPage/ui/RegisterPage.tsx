import {Link, useNavigate} from "react-router-dom";
import {HOME_PATH, LOGIN_PATH} from "../../../Shared/config/routes.ts";
import {RegisterForm} from "../../../Features/auth-by-email/register";


export const RegisterPage = () => {
    const navigate = useNavigate()

    function handleRegisterSuccess() {
        navigate(HOME_PATH)
    }

    return(
        <div>
            <h2>Регистрация</h2>
            <RegisterForm onSuccess={handleRegisterSuccess}/>
            <Link to={LOGIN_PATH}>Уже есть аккаунт? Войти</Link>
        </div>
    )
}