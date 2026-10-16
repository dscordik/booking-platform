import {Link, useNavigate} from "react-router-dom"
import {HOME_PATH, REGISTER_PATH} from "../../../Shared/config/routes.ts";
import {LoginForm} from "../../../Features/auth-by-email/login";


export const LoginPage = () => {
    const navigate = useNavigate()

    function handleLoginSuccess() {
        navigate(HOME_PATH)
    }

    return(
        <div>
            <h2>Вход</h2>
            <LoginForm onSuccess={handleLoginSuccess}/>
            <Link to={REGISTER_PATH}>Нет аккаунта? Зарегистрироваться</Link>
        </div>
    )
}