import * as React from "react";
import type {ReactNode} from "react";
import {useAuth} from "../../Entities/session";
import {Navigate} from "react-router-dom";
import {HOME_PATH, LOGIN_PATH} from "../../Shared/config/routes.ts";
import {Spinner} from "../../Shared/ui/Spinner/Spinner";


interface ProtectedAdminRouteProps{
    children:ReactNode
}

export const ProtectedAdminRoute:React.FC<ProtectedAdminRouteProps> = ({children}) => {
    const {user, isLoading} = useAuth()
    if (isLoading === true) {
        return (<Spinner text='Загрузка...'/>)
    }
    if (!user) {
        return(<Navigate to={LOGIN_PATH} replace/>)
    }
    if (user.role !== 'admin') {
        return (<Navigate to={HOME_PATH} replace/>)
    }
    return(children)
}