import {useEffect, useState} from "react";
import {getSlots, type SlotOut} from "../../../Entities/slot";
import {createBooking} from "../../../Entities/booking";
import {LOGIN_PATH} from "../../../Shared/config/routes";
import {useNavigate} from "react-router-dom";

export const useBookSlot = (service_id:number, onBooked?:()=>void) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10))
    const [slots, setSlots] = useState<SlotOut[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [bookingError, setBookingError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadSlots(selectedDate)
    }, [service_id,selectedDate]);

    async function loadSlots(date:string) {
        setIsLoadingSlots(true)
        try {
            const allSlots = await getSlots(service_id, date)
            setSlots(allSlots)
        }catch (e) {
            if (e instanceof Error) {
                setBookingError(e.message)
            }
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
        } catch (error:any) {
            if (error?.response?.status === 409) {
                setBookingError('Слот только что заняли, выберите другой')
                await loadSlots(selectedDate)
            } else if (error?.response?.status === 500) {
                setBookingError('Не удалось забронировать')
            }else if (error?.response?.status === 401) {
                navigate(LOGIN_PATH)
            } else {
                setBookingError('не удалось забронировать')
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