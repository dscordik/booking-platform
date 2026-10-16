import {useAuth} from "../../../Entities/session";
import {useNavigate} from "react-router-dom";
import {LOGIN_PATH} from "../../../Shared/config/routes.ts";


export const ProfilePage = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate(LOGIN_PATH)
    }

    return(
        <div>
            <h2>Профиль</h2>
            <p>Привет {user?.first_name || user?.email}</p>
            <button onClick={() => handleLogout()}>Выйти</button>
        </div>
    )
}