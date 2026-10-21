import type {BookingCreate, BookingOut} from "../model/types"
import {api} from "../../../Shared/api/base"

export const getMyBookings = async():Promise<BookingOut[]> => {
    const res = await api.get<BookingOut[]>('/bookings/me')
    return res.data
}

export const createBooking = async(value:BookingCreate):Promise<BookingOut> => {
    const res = await api.post<BookingOut>('/bookings', value)
    return res.data
}

export const cancelBooking = async(id:number):Promise<BookingOut> => {
    const res = await api.patch<BookingOut>(`/bookings/${id}/cancel`)
    return res.data
}