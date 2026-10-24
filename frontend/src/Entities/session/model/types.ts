export type UserRole = 'user' | 'admin'

export interface User{
    id:number,
    email:string,
    first_name?:string,
    role:UserRole,
    created_at:string,
    telegram_id:number | null
}

export interface Token{
    access_token:string,
    token_type:string
}