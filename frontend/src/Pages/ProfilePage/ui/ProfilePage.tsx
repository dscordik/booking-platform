import {useAuth} from "../../../Entities/session";
import {Link, useNavigate} from "react-router-dom";
import {LOGIN_PATH, MY_BOOKINGS_PATH} from "../../../Shared/config/routes";
import "./ProfilePage.css";

export const ProfilePage = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate(LOGIN_PATH)
    }

    return (
        <div className="profile-page">
            <h2>Профиль</h2>
            <p className="profile-page__greeting">Привет, {user?.first_name || user?.email}</p>
            <Link to={MY_BOOKINGS_PATH}><p>Мои записи</p></Link>
            <button className="profile-page__logout" onClick={() => handleLogout()}>Выйти</button>
        </div>
    )
}