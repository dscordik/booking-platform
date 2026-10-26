import type {BookingStatus} from "./types.ts";

export const bookingsKeys = {
    me: ['bookings', 'me'],
    admin:(status?:BookingStatus, serviceId?:number) => ['bookings', 'admin', status, serviceId]
}