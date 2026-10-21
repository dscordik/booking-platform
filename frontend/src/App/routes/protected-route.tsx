import * as React from "react";
import type {ReactNode} from "react";
import {useAuth} from "../../Entities/session";
import {Navigate} from "react-router-dom";
import {LOGIN_PATH} from "../../Shared/config/routes.ts";
import {Spinner} from "../../Shared/ui/Spinner/Spinner";


interface ProtectedRouteProps{
    children:ReactNode
}

export const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
    const {user, isLoading} = useAuth()
    if (isLoading === true) {
        return (<Spinner text='Загрузка...'/>)
    }
    if (!user) {
        return(<Navigate to={LOGIN_PATH} replace/>)
    }
    return(children)
}