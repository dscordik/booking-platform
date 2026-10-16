import * as React from "react";
import {useRegister} from "../model/use-register.ts";


interface RegisterFormProps{
    onSuccess:() => void
}

export const RegisterForm:React.FC<RegisterFormProps> = ({onSuccess}) => {
    const {email, setEmail, password, setPassword, firstName, setFirstName, isLoading, error, handleSubmit} = useRegister(onSuccess)

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type='password' placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type='text' placeholder='Введите имя (необязательно)' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <button type='submit' disabled={isLoading}>Зарегистрироваться</button>
                {error && (<p>{error}</p>)}
            </form>
        </div>
    )
}