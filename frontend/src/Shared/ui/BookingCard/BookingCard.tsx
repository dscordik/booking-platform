import type {BookingOut} from "../../../Entities/booking";
import * as React from "react";
import "./BookingCard.css";
import {Button} from "../Button/Button";

interface BookingCardProps{
    booking:BookingOut,
    onCancel?: () => void
}

const STATUS_LABELS: Record<BookingOut['status'], string> = {
    pending: 'Ожидает',
    confirmed: 'Подтверждена',
    cancelled: 'Отменена',
    done: 'Завершена'
}

export const BookingCard:React.FC<BookingCardProps> = ({booking, onCancel}) => {
    const future = new Date(booking.slot.start_at) > new Date()
    const cancel = ['pending', 'confirmed'].includes(booking.status) && future

    return(
        <article className={`booking-card booking-card--${booking.status}`}>
            <div className="booking-card__info">
                <h3 className="booking-card__title">{booking.slot.service_title}</h3>
                <p className="booking-card__date">
                    {new Date(booking.slot.start_at).toLocaleString('ru-RU', {day:'2-digit', month:'long', hour:'2-digit', minute:'2-digit'})}
                </p>
            </div>
            <div className="booking-card__side">
                <span className={`booking-card__status booking-card__status--${booking.status}`}>
                    {STATUS_LABELS[booking.status]}
                </span>
                {cancel && (
                    <Button className="booking-card__cancel" variant="danger" size="sm" onClick={() => onCancel?.()}>Отменить</Button>
                )}
            </div>
        </article>
    )
}