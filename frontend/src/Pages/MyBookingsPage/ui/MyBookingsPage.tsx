import {useEffect, useMemo, useState} from "react";
import {type BookingOut, cancelBooking, getMyBookings} from "../../../Entities/booking";
import {BookingCard} from "../../../Shared/ui/BookingCard/BookingCard"
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import "./MyBookingsPage.css";

export const MyBookingsPage = () => {
    const [bookings, setBookings] = useState<BookingOut[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const allBookings = useMemo(() => {
        const coming = bookings.filter((item) => new Date(item.slot.start_at) > new Date() && item.status !== 'cancelled')
        const past = bookings.filter((item) => !(new Date(item.slot.start_at) > new Date() && item.status !== 'cancelled'))
        return{coming, past}
    }, [bookings])


    useEffect(() => {
        loadBookings()
    }, []);

    async function loadBookings() {
        setIsLoading(true)
        try {
            const bookings = await getMyBookings()
            setBookings(bookings)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCancel(id:number) {
        const confirmed = window.confirm('Вы действительно хотите отменить запись?')
        if (!confirmed) {
            return
        }
        try{
            await cancelBooking(id)
            await loadBookings()
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
        }
    }

    return(
        <div className="my-bookings">
            <h2 className="my-bookings__title">Мои записи</h2>
            {isLoading ? (
                <Spinner text='Загрузка записей...'/>
            ):(
                bookings.length === 0 ? (
                    <p className="my-bookings__empty">У вас пока нет броней</p>
                ) : (
                    <>
                        <section className="my-bookings__section">
                            <h3 className="my-bookings__section-title">Предстоящие записи</h3>
                            {allBookings.coming.length === 0 ? (
                                <p className="my-bookings__empty">Предстоящих записей нет</p>
                            ) : (
                                <div className="my-bookings__list">
                                    {allBookings.coming.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} onCancel={() => handleCancel(booking.id)}/>
                                    ))}
                                </div>
                            )}
                        </section>
                        <section className="my-bookings__section">
                            <h3 className="my-bookings__section-title">История записей</h3>
                            {allBookings.past.length === 0 ? (
                                <p className="my-bookings__empty">История записей пустая</p>
                            ) : (
                                <div className="my-bookings__list">
                                    {allBookings.past.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking}/>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )
            )}
            {error && <p className="my-bookings__error" role="alert">{error}</p>}
        </div>
    )
}