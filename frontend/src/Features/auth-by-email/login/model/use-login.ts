import {useState} from "react";
import {useAuth} from "../../../../Entities/session";
import * as React from "react";
import {getErrorMessage} from "../../../../Shared/lib/get-error-message.ts";

export const useLogin = (onSuccess: () => void ) => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {login} = useAuth()

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        try {
            await login(email, password)
            onSuccess()
        } catch (error) {
            setError(getErrorMessage(error, "Не удалось войти"))
        }  finally {
            setIsLoading(false)
        }
    }
    return {email, setEmail, password, setPassword, isLoading, error, handleSubmit}
}