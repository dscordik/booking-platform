import * as React from 'react'
import {useState, createContext, useContext, type ReactNode, useEffect} from "react";
import type {User} from "./types";
import {login as loginReq, register as regReq, getMe} from "../api/session-api";
import {getToken, setToken, removeToken} from "../../../Shared/lib/token-storage";

interface AuthContextType{
    user:User | null,
    isLoading:boolean,
    login:(email:string, password:string) => Promise<void>,
    register:(email:string, password:string, firstName?:string) => Promise<void>,
    logout: () => void
}
interface ProviderProps{
    children:ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider:React.FC<ProviderProps> = ({children}:ProviderProps) => {
    const [user,setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const restoreSession = async() => {
            const token = getToken()
            try {
                if (token) {
                    const userData = await getMe()
                    setUser(userData)
                }
            } catch {
                removeToken()
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }
        restoreSession()
    }, []);

    async function loginUser(email:string, password:string) {
        const token = await loginReq(email, password)
        setToken(token.access_token)
        const user = await getMe()
        setUser(user)
    }
    async function registerUser(email:string, password:string, firstName?:string) {
        const regUser = await regReq(email, password, firstName)
        await loginUser(regUser.email, password)
    }
    function logoutUser(){
        removeToken()
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{user:user, login:loginUser, register:registerUser, logout:logoutUser, isLoading:isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth может быть использован с AuthProvider')
    }
    return context
}