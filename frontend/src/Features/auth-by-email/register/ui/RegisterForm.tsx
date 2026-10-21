import * as React from "react";
import {useRegister} from "../model/use-register";
import "../../../../Shared/ui/AuthForm.css";
import { Input } from "../../../../Shared/ui/Input/Input";
import {Button} from "../../../../Shared/ui/Button/Button";

interface RegisterFormProps {
    onSuccess: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({onSuccess}) => {
    const {email, setEmail, password, setPassword, firstName, setFirstName, isLoading, error, handleSubmit} = useRegister(onSuccess)

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <Input type='email' autoComplete="email" placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input type='password' autoComplete="new-password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Input type='text' autoComplete="given-name" placeholder='Введите имя (необязательно)' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            <Button className="auth-form__submit" type='submit' fullWidth disabled={isLoading}>Зарегистрироваться</Button>
            {error && (<p className="auth-form__error" role="alert">{error}</p>)}
        </form>
    )
}