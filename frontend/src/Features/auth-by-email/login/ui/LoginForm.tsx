import * as React from "react";
import {useLogin} from "../model/use-login";
import "../../../../Shared/ui/AuthForm.css";
import {Input} from "../../../../Shared/ui/Input/Input";
import {Button} from "../../../../Shared/ui/Button/Button";

interface LoginFormProps {
    onSuccess: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({onSuccess}) => {
    const {email, setEmail, password, setPassword, isLoading, error, handleSubmit} = useLogin(onSuccess)
    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <Input type='email' autoComplete="email" placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input type='password' autoComplete="current-password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button className="auth-form__submit" type='submit' fullWidth disabled={isLoading}>Войти</Button>
            {error && (<p className="auth-form__error" role="alert">{error}</p>)}
        </form>
    )
}