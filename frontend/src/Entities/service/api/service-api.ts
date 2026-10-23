import type {Service, ServiceCreate} from "../model/types"
import {api} from "../../../Shared/api/base"

export const getServices = async():Promise<Service[]> => {
    const res = await api.get('/services/')
    return res.data
}

export const getService = async(id:number):Promise<Service> => {
    const res = await api.get(`/services/${id}`)
    return res.data
}

export const createService = async(value:Partial<ServiceCreate>):Promise<Service> => {
    const res = await api.post<Service>('/services/', value)
    return res.data
}

export const updateService = async(id:number, value:Partial<ServiceCreate>):Promise<Service> => {
    const res = await api.patch<Service>(`/services/${id}`, value)
    return res.data
}

export const deleteService = async(id:number):Promise<void> => {
    await api.delete(`/services/${id}`)
}