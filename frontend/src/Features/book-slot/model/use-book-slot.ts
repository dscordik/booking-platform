import {useEffect, useState} from "react";
import {getSlots, type SlotOut} from "../../../Entities/slot";
import {createBooking} from "../../../Entities/booking";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import axios from "axios";

export const useBookSlot = (service_id:number, onBooked?:()=>void) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10))
    const [slots, setSlots] = useState<SlotOut[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [bookingError, setBookingError] = useState<string | null>(null)

    useEffect(() => {
        loadSlots(selectedDate)
    }, [service_id,selectedDate]);

    async function loadSlots(date:string) {
        setIsLoadingSlots(true)
        try {
            const allSlots = await getSlots(service_id, date)
            setSlots(allSlots)
        }catch (error) {
            setBookingError(getErrorMessage(error))
        } finally {
            setIsLoadingSlots(false)
        }
    }

    async function bookSlot(comment?:string) {
        if (!selectedSlotId) {
            return
        }
        setIsBooking(true)
        try {
            await  createBooking({slot_id: selectedSlotId, comment})
            onBooked?.()
            setSelectedSlotId(null)
            setBookingError(null)
        } catch (error:unknown) {
            if (axios.isAxiosError(error)){
                if (error?.response?.status === 409) {
                    setBookingError('Слот только что заняли, выберите другой')
                    await loadSlots(selectedDate)
                } else if (error?.response?.status === 500) {
                    setBookingError(getErrorMessage(error, 'Не удалось забронировать'))
                } else {
                    setBookingError(getErrorMessage(error))
                }
            } else {
                setBookingError(getErrorMessage(error))
            }
        } finally {
            setIsBooking(false)
        }
    }

    function selectSlot(id:number) {
        setSelectedSlotId(id)
        setBookingError(null)
    }

    return {slots, isLoadingSlots, selectedSlotId, selectedDate, setSelectedDate, isBooking, bookingError, bookSlot, loadSlots, selectSlot}
}