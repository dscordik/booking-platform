import type {BookingOut} from "../../../Entities/booking";
import * as React from "react";

interface BookingCardProps{
    booking:BookingOut,
    onCancel?: () => void
}

export const BookingCard:React.FC<BookingCardProps> = ({booking, onCancel}) => {
    const future = new Date(booking.slot.start_at) > new Date()
    const cancel = ['pending', 'confirmed'].includes(booking.status) && future

    return(
        <div>
            <h3>{booking.slot.service_title}</h3>
            <p>{new Date(booking.slot.start_at).toLocaleString('ru-RU', {day:'2-digit', month:'long', hour:'2-digit', minute:'2-digit'})}</p>
            <p>{{ pending: 'Ожидает', confirmed: 'Подтверждена', cancelled: 'Отменена', done: 'Завершена' }[booking.status]}</p>
            {cancel && <button onClick={() => onCancel?.()}>Отменить</button>}
        </div>
    )
}