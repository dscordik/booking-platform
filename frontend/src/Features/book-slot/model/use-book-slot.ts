import {useState} from "react";
import {getSlots} from "../../../Entities/slot";
import {createBooking} from "../../../Entities/booking";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import axios from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {slotsKeys} from "../../../Entities/slot/model/query-keys.ts";
import {queryClient} from "../../../Shared/lib/query-client.ts";
import {bookingsKeys} from "../../../Entities/booking/model/query-keys.ts";

export const useBookSlot = (service_id:number, onBooked?:()=>void) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10))
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
    const [bookingError, setBookingError] = useState<string | null>(null)

    const {data: slotsData, isPending: isLoadingSlots, error: queryError} = useQuery({
        queryKey:slotsKeys.all(service_id, selectedDate),
        queryFn:() => getSlots(service_id, selectedDate)
    })

    const { mutate: bookSlotMutate, isPending: isBooking } = useMutation({
        mutationFn:(comment?:string) => createBooking({slot_id:selectedSlotId!, comment}),
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: slotsKeys.all(service_id, selectedDate) })
            queryClient.invalidateQueries({ queryKey: bookingsKeys.me })
            setSelectedSlotId(null)
            onBooked?.()
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setBookingError('Слот только что заняли, выберите другой')
                queryClient.invalidateQueries({ queryKey: slotsKeys.all(service_id, selectedDate) })
            } else {
                setBookingError(getErrorMessage(error))
            }
        }
    })

    async function bookSlot(comment?:string) {
        if (!selectedSlotId) {
            return
        }
        setBookingError(null)
        bookSlotMutate(comment)
    }

    function selectSlot(id:number) {
        setSelectedSlotId(id)
        setBookingError(null)
    }

    const currentError = queryError || bookingError

    return {slots: slotsData ?? [], isLoadingSlots, bookSlot, selectSlot, currentError, isBooking, setSelectedDate}
}