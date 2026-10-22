export interface Service{
    id:number,
    title:string,
    description:string | null,
    duration_min:number,
    price:number,
    is_active:boolean
}

export interface ServiceCreate{
    title:string,
    description?:string,
    duration_min:number,
    price:number
}