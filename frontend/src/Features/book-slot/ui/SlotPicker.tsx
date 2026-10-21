import * as React from "react";
import {useBookSlot} from "../model/use-book-slot.ts";
import {useMemo, useState} from "react";

interface SlotPickerProps{
    serviceId:number,
    onBooked?:() => void
}

export const SlotPicker:React.FC<SlotPickerProps> = ({serviceId, onBooked}) => {
    const [comment, setComment] = useState('')
    const [success, setSuccess] = useState(false)

    function handleBooked() {
        setSuccess(true)
        onBooked?.()
        setTimeout(() => setSuccess(false), 3000)
    }

    const {slots,isLoadingSlots,selectedDate,setSelectedDate,selectedSlotId,selectSlot,isBooking,bookingError,bookSlot} = useBookSlot(serviceId, handleBooked)

    const days = useMemo(() => {
        const result = []
        for (let i = 0; i < 7; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i)
            result.push({
                date:d.toISOString().slice(0,10),
                label:d.toLocaleDateString('ru-RU',{ weekday:'short',day:'numeric', month:'short'})
            })
        }
        return result
    }, [])


    return(
        <div>
            {isLoadingSlots && <div>Загрузка слотов</div>}
            {days.map((day) => (
                <button key={day.date} className={`slot-picker__day ${day.date === selectedDate ? 'slot-picker__day--active' : ''}`} onClick={() => setSelectedDate(day.date)}>
                    {day.label}
                </button>
            ))}
            {slots.length === 0 ? (
                <p>Слотов нету</p>
            ) : (
                <div>
                    {slots.map((slot) => (
                        <div key={slot.id} className={`slot-picker__slot ${slot.is_booked ? 'slot-picker__slot--booked' : ''} ${slot.id === selectedSlotId ? 'slot-picker__slot--selected' : ''}`} onClick={() => !slot.is_booked && selectSlot(slot.id)}>
                            <p>{new Date(slot.start_at).toLocaleTimeString('ru-RU',{ hour:'2-digit',minute:'2-digit'})}</p>
                        </div>
                    ))}
                </div>
            )}
            <input placeholder='Комментарий' value={comment} onChange={(e) => setComment(e.target.value)}/>
            <button disabled={isBooking || selectedSlotId === null} onClick={() => bookSlot(comment)}>{isBooking ? 'Бронируем' : 'Записаться'}</button>
            {success && <div>Запись создана</div>}
            {bookingError && <div>{bookingError}</div>}
        </div>
    )
}