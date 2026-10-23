import {useState} from "react";
import {useAuth} from "../../../../Entities/session";
import * as React from "react";
import {getErrorMessage} from "../../../../Shared/lib/get-error-message.ts";

export const useRegister = (onSuccess:() => void) => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {register} = useAuth()

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        try{
            await register(email, password, firstName)
            onSuccess()
        } catch (error) {
            setError(getErrorMessage(error, "Не удалось зарегистрироваться"))
        }  finally {
            setIsLoading(false)
        }
    }
    return {email, setEmail, password, setPassword, firstName, setFirstName, isLoading, error, handleSubmit}
}