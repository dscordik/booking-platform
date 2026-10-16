import {useState} from "react";
import {useAuth} from "../../../../Entities/session";
import * as React from "react";


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
        } catch (error:any) {
            const message = error?.response?.data.detail || 'Не удалось зарегистрироваться'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }
    return {email, setEmail, password, setPassword, firstName, setFirstName, isLoading, error, handleSubmit}
}