import {api} from "../../../Shared/api/base";
import type {User, Token} from "../model/types";

export const login = async(email:string, password:string):Promise<Token> => {
    const res = await api.post<Token>('/auth/login', {email, password})
    return res.data
}

export const register = async(email:string, password:string, firstName?:string):Promise<User> => {
    const res = await api.post<User>('/auth/register', {email, password, first_name:firstName})
    return res.data
}

export const getMe = async():Promise<User> => {
    const res = await api.get<User>('/me')
    return res.data
}