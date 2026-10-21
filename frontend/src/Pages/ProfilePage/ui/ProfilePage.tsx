import {useAuth} from "../../../Entities/session";
import {Link, useNavigate} from "react-router-dom";
import {LOGIN_PATH, MY_BOOKINGS_PATH} from "../../../Shared/config/routes";
import "./ProfilePage.css";
import {Button} from "../../../Shared/ui/Button/Button";

export const ProfilePage = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const displayName = user?.first_name || user?.email || ''

    function handleLogout() {
        logout()
        navigate(LOGIN_PATH)
    }

    return (
        <div className="profile-page">
            <div className="profile-page__avatar" aria-hidden="true">
                {displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-page__title">Профиль</h2>
            <p className="profile-page__greeting">Привет, {displayName}</p>
            <div className="profile-page__actions">
                <Link className="button button--primary" to={MY_BOOKINGS_PATH}>Мои записи</Link>
                <Button variant="secondary" onClick={() => handleLogout()}>Выйти</Button>
            </div>
        </div>
    )
}