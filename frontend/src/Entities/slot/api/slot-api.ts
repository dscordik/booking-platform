import {api} from "../../../Shared/api/base";
import type {SlotOut} from "../model/types";

export const getSlots = async(service_id:number, date?:string):Promise<SlotOut[]> => {
    const res = await api.get<SlotOut[]>('/slots', {params:{service_id, date}})
    return res.data
}

export const createSlot = async(params:{service_id:number, start_at:string, end_at:string}):Promise<SlotOut> => {
    const res = await api.post<SlotOut>('/slots', params)
    return res.data
}

export const deleteSlot = async(id:number):Promise<void> => {
    await api.delete(`/slots/${id}`)
}