import {useAuth} from "../../../Entities/session";
import {Link, useNavigate} from "react-router-dom";
import {LOGIN_PATH, MY_BOOKINGS_PATH} from "../../../Shared/config/routes";
import "./ProfilePage.css";
import {Button} from "../../../Shared/ui/Button/Button";
import {useState} from "react";
import {getTelegramLinkCode} from "../../../Entities/session/api/session-api.ts";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";

export const ProfilePage = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const displayName = user?.first_name || user?.email || ''
    const [linkData, setLinkData] = useState<{code:string, deep_link:string} | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [linkError, setLinkError] = useState<string | null>(null)

    function handleLogout() {
        logout()
        navigate(LOGIN_PATH)
    }

    async function handleGenerateCode() {
        setIsGenerating(true)
        setLinkError(null)
        try {
            const code = await getTelegramLinkCode()
            setLinkData(code)
        } catch (error) {
            setLinkError(getErrorMessage(error))
        } finally {
            setIsGenerating(false)
        }
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
            {user?.telegram_id ? (
                <p>Telegram бот подключен</p>
            ) : (
                <div>
                    {linkData ? (
                        <div>
                            <a href={linkData.deep_link} target='_blank' rel='noreferrer'>Открыть бота</a>
                            <p>После подтверждения в боте обновите страницу (F5) — статус обновится.</p>

                        </div>
                    ) : (
                        <div>
                            <Button disabled={isGenerating} onClick={() => handleGenerateCode()}>{isGenerating ? 'Генерируем...' : 'Подключить Telegram'}</Button>
                        </div>
                    )}
                    {linkError && <div role="alert">{linkError}</div>}
                </div>
            )}

        </div>
    )
}