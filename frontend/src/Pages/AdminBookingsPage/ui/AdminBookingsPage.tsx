import * as React from "react";
import {useEffect, useState} from "react";
import {type BookingAdminOut, getAllBookings, updateBookingStatus} from "../../../Entities/booking";
import {getServices, type Service} from "../../../Entities/service";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Ожидает' },
    { value: 'confirmed', label: 'Подтверждена' },
    { value: 'cancelled', label: 'Отменена' },
    { value: 'done', label: 'Выполнена' },
]

export const AdminBookingsPage:React.FC = () => {
    const [bookings, setBookings] = useState<BookingAdminOut[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [filterStatus, setFilterStatus] = useState('')
    const [filteredServiceId, setFilteredServiceId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadServices()
    }, []);

    useEffect(() => {
        loadBookings()
    }, [filterStatus, filteredServiceId]);

    async function loadBookings() {
        setIsLoading(true)
        try {
            const params = {
                status: filterStatus || undefined,
                service_id: filteredServiceId || undefined
            }
            const currentBookings = await getAllBookings(params)
            setBookings(currentBookings)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function loadServices() {
        setIsLoading(true)
        try {
            const currentServices = await getServices()
            setServices(currentServices)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function handleStatusChange(id: number, newStatus: string) {
        try {
            await updateBookingStatus(id, newStatus)
            await loadBookings()
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    return (
        <div>
            {isLoading ? <Spinner text='Загрузка...'/> : (
                <div>
                    <div className="admin-page__header"><h1>Управление записями</h1></div>
                    <div className="admin-page__filters">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">Все статусы</option>
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select value={filteredServiceId ?? ''} onChange={(e) => setFilteredServiceId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">Все услуги</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.title}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p>{error}</p>}
                    {bookings.length === 0 ? (
                        <div>Записей нет</div>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Пользователь</th>
                                    <th>Услуга</th>
                                    <th>Дата/время</th>
                                    <th>Статус</th>
                                    <th>Комментарий</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.user_email}</td>
                                        <td>{booking.slot.service_title}</td>
                                        <td>{new Date(booking.slot.start_at).toLocaleString()}</td>
                                        <td>
                                            {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.label ?? booking.status}
                                        </td>
                                        <td>{booking.comment || '—'}</td>
                                        <td className="admin-table__actions">
                                            <select value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value)}>
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}