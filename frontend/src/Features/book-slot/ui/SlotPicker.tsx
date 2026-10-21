import * as React from "react";
import {useMemo, useState} from "react";
import {useBookSlot} from "../model/use-book-slot.ts";
import "./SlotPicker.css";
import {Input} from "../../../Shared/ui/Input/Input";
import {Button} from "../../../Shared/ui/Button/Button";

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
        <div className="slot-picker">
            <h3 className="slot-picker__title">Выберите время</h3>

            <div className="slot-picker__days">
                {days.map((day) => (
                    <button key={day.date} type="button" className={`slot-picker__day${day.date === selectedDate ? ' slot-picker__day--active' : ''}`} aria-pressed={day.date === selectedDate} onClick={() => setSelectedDate(day.date)}>
                        {day.label}
                    </button>
                ))}
            </div>

            {isLoadingSlots ? (
                <p className="slot-picker__status">Загрузка слотов...</p>
            ) : slots.length === 0 ? (
                <p className="slot-picker__status">На эту дату слотов нет</p>
            ) : (
                <div className="slot-picker__slots">
                    {slots.map((slot) => (
                        <button key={slot.id} type="button" className={['slot-picker__slot', slot.is_booked && 'slot-picker__slot--booked', slot.id === selectedSlotId && 'slot-picker__slot--selected'].filter(Boolean).join(' ')} disabled={slot.is_booked} aria-pressed={slot.id === selectedSlotId} onClick={() => selectSlot(slot.id)}>
                            {new Date(slot.start_at).toLocaleTimeString('ru-RU',{ hour:'2-digit',minute:'2-digit'})}
                        </button>
                    ))}
                </div>
            )}
            <Input className="slot-picker__comment" placeholder='Комментарий' value={comment} onChange={(e) => setComment(e.target.value)}/>
            <Button className="slot-picker__submit" disabled={isBooking || selectedSlotId === null} onClick={() => bookSlot(comment)}>
                {isBooking ? 'Бронируем...' : 'Записаться'}
            </Button>
            {success && <p className="slot-picker__message slot-picker__message--success" role="status">Запись создана</p>}
            {bookingError && <p className="slot-picker__message slot-picker__message--error" role="alert">{bookingError}</p>}
        </div>
    )
}