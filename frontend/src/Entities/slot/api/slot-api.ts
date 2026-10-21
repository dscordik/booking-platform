import {api} from "../../../Shared/api/base";
import type {SlotOut} from "../model/types";

export const getSlots = async(service_id:number, date?:string):Promise<SlotOut[]> => {
    const res = await api.get<SlotOut[]>('/slots', {params:{service_id, date}})
    return res.data
}