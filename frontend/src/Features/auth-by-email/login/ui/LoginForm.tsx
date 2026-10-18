import * as React from "react";
import {useLogin} from "../model/use-login";
import "../../../../Shared/ui/AuthForm.css";

interface LoginFormProps {
    onSuccess: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({onSuccess}) => {
    const {email, setEmail, password, setPassword, isLoading, error, handleSubmit} = useLogin(onSuccess)
    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input type='email' placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="auth-form__submit" type='submit' disabled={isLoading}>Войти</button>
            {error && (<p className="auth-form__error">{error}</p>)}
        </form>
    )
}