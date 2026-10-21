import {useEffect, useMemo, useState} from "react";
import {type BookingOut, cancelBooking, getMyBookings} from "../../../Entities/booking";
import {BookingCard} from "../../../Shared/ui/BookingCard/BookingCard"

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
        <div>
            {isLoading ? (
                <p>Загрузка..</p>
            ):(
                <div>
                    {bookings.length === 0 ? (
                        <p>У вас пока нет броней</p>
                    ) : (
                        <div>
                            <div>
                                <h2>Предстоящие записи</h2>
                                {allBookings.coming.length === 0 ? (
                                    <p>Предстоящих записей нет</p>
                                ) : (
                                    <div>
                                        {allBookings.coming.map((booking) => (
                                            <BookingCard key={booking.id} booking={booking} onCancel={() => handleCancel(booking.id)}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2>История записей</h2>
                                {allBookings.past.length === 0 ? (
                                    <p>История записей пустая</p>
                                ) : (
                                    <div>
                                        {allBookings.past.map((booking) => (
                                            <BookingCard key={booking.id} booking={booking}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            )}
            {error && <p>{error}</p>}
        </div>
    )
}