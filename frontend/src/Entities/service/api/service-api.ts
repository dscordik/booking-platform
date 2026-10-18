import type {Service} from "../model/types"
import {api} from "../../../Shared/api/base"


export const getServices = async():Promise<Service[]> => {
    const res = await api.get('/services')
    return res.data
}

export const getService = async(id:number):Promise<Service> => {
    const res = await api.get(`/services/${id}`)
    return res.data
}