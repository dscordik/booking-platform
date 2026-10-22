import type {SlotOut} from "../../slot";

export interface BookingOut{
    id:number,
    slot_id:number,
    status:'pending' | 'confirmed' | 'cancelled' | 'done',
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