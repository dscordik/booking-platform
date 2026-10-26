import {useMemo} from "react";
import {cancelBooking, getMyBookings} from "../../../Entities/booking";
import {BookingCard} from "../../../Shared/ui/BookingCard/BookingCard"
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import "./MyBookingsPage.css";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {bookingsKeys} from "../../../Entities/booking/model/query-keys.ts";
import {queryClient} from "../../../Shared/lib/query-client.ts";

export const MyBookingsPage = () => {
    const {data, isPending, error} = useQuery({
        queryKey:bookingsKeys.me,
        queryFn:() => getMyBookings()
    })


    const allBookings = useMemo(() => {
        const list = data ?? []
        const coming = list.filter((item) => new Date(item.slot.start_at) > new Date() && item.status !== 'cancelled')
        const past = list.filter((item) => !(new Date(item.slot.start_at) > new Date() && item.status !== 'cancelled'))
        return{coming, past}
    }, [data])

    const cancel = useMutation({
        mutationFn:(id:number) => cancelBooking(id),
        onSuccess:() => queryClient.invalidateQueries({queryKey:bookingsKeys.me})
    })

    function handleCancel(id:number) {
        const confirmed = window.confirm('Вы действительно хотите отменить эту запись?')
        if (confirmed) {
            cancel.mutate(id)
        }
    }

    return(
        <div className="my-bookings">
            <h2 className="my-bookings__title">Мои записи</h2>
            {isPending ? (
                <Spinner text='Загрузка записей...'/>
            ):(
                !data || data.length === 0 ? (
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
            {error && <p className="my-bookings__error" role="alert">{getErrorMessage(error)}</p>}
        </div>
    )
}