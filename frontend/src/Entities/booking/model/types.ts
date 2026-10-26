import type {SlotOut} from "../../slot";

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'done'

export interface BookingOut{
    id:number,
    slot_id:number,
    status:BookingStatus,
    comment:string|null,
    created_at:string,
    slot:SlotOut
}

export interface BookingCreate{
    slot_id:number,
    comment?:string
}

export interface BookingAdminOut extends BookingOut{
    user_email:string
}