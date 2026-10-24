import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getTelegramLinkCode, useAuth} from "../../../Entities/session";
import {LOGIN_PATH, MY_BOOKINGS_PATH} from "../../../Shared/config/routes";
import {getErrorMessage} from "../../../Shared/lib/get-error-message";
import {Button} from "../../../Shared/ui/Button/Button";
import "./ProfilePage.css";

export const ProfilePage = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const displayName = user?.first_name || user?.email || ''
    const [linkData, setLinkData] = useState<{code: string, deep_link: string} | null>(null)
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
            const data = await getTelegramLinkCode()
            setLinkData(data)
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

            <section className="profile-page__telegram">
                <h3 className="profile-page__telegram-title">Уведомления в Telegram</h3>

                {user?.telegram_id ? (
                    <p className="profile-page__telegram-status">Telegram подключён</p>
                ) : linkData ? (
                    <div className="profile-page__telegram-link">
                        <p className="profile-page__telegram-text">
                            Откройте бота и нажмите Start, чтобы завершить привязку.
                        </p>
                        <a
                            className="button button--primary profile-page__telegram-open"
                            href={linkData.deep_link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Открыть бота
                        </a>
                        <p className="profile-page__telegram-hint">
                            После подтверждения в боте обновите страницу (F5), статус изменится.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="profile-page__telegram-text">
                            Получайте сообщения о новых записях и смене их статуса.
                        </p>
                        <Button
                            className="profile-page__telegram-connect"
                            variant="secondary"
                            disabled={isGenerating}
                            onClick={() => handleGenerateCode()}
                        >
                            {isGenerating ? 'Генерируем...' : 'Подключить Telegram'}
                        </Button>
                    </>
                )}

                {linkError && <p className="profile-page__telegram-error" role="alert">{linkError}</p>}
            </section>
        </div>
    )
}