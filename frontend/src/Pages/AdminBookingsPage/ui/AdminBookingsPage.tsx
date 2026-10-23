import * as React from "react";
import {useEffect, useState} from "react";
import {type BookingAdminOut, getAllBookings, updateBookingStatus} from "../../../Entities/booking";
import {getServices, type Service} from "../../../Entities/service";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {Select} from "../../../Shared/ui/Select/Select";
import {StatusBadge} from "../../../Shared/ui/StatusBadge/StatusBadge";
import {formatDateTime} from "../../../Shared/lib/format-date";
import "../../../Shared/ui/AdminPage/AdminPage.css";
import "../../../Shared/ui/Table/Table.css";
import "./AdminBookingsPage.css";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";

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
    const [isLoading, setIsLoading] = useState(true)
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
        }catch (error) {
            setError(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    async function loadServices() {
        try {
            const currentServices = await getServices()
            setServices(currentServices)
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    async function handleStatusChange(id: number, newStatus: string) {
        try {
            await updateBookingStatus(id, newStatus)
            await loadBookings()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    return (
        <div className="admin-page admin-bookings-page">
            <div className="admin-page__header"><h2 className="admin-page__title">Управление записями</h2></div>
            <div className="admin-page__filters">
                <Select className="admin-page__filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Все статусы</option>
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
                <Select className="admin-page__filter" value={filteredServiceId ?? ''} onChange={(e) => setFilteredServiceId(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">Все услуги</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                </Select>
            </div>
            {error && <p className="admin-page__error" role="alert">{error}</p>}
            {isLoading ? <Spinner text='Загрузка...'/> : bookings.length === 0 ? (
                <div className="admin-page__empty">Записей нет</div>
            ) : (
                <div className="admin-table">
                    <table className="admin-table__table">
                        <thead>
                        <tr>
                            <th className="admin-table__head-cell">ID</th>
                            <th className="admin-table__head-cell">Пользователь</th>
                            <th className="admin-table__head-cell">Услуга</th>
                            <th className="admin-table__head-cell">Дата/время</th>
                            <th className="admin-table__head-cell">Статус</th>
                            <th className="admin-table__head-cell">Комментарий</th>
                            <th className="admin-table__head-cell admin-table__head-cell--actions">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map(booking => (
                            <tr className="admin-table__row" key={booking.id}>
                                <td className="admin-table__cell admin-table__cell--muted">#{booking.id}</td>
                                <td className="admin-table__cell">{booking.user_email}</td>
                                <td className="admin-table__cell admin-table__cell--strong">{booking.slot.service_title}</td>
                                <td className="admin-table__cell admin-table__cell--nowrap">{formatDateTime(booking.slot.start_at)}</td>
                                <td className="admin-table__cell">
                                    <StatusBadge variant={booking.status}>
                                        {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.label ?? booking.status}
                                    </StatusBadge>
                                </td>
                                <td className="admin-table__cell admin-table__cell--muted admin-bookings-page__comment" title={booking.comment ?? undefined}>
                                    {booking.comment || '—'}
                                </td>
                                <td className="admin-table__cell admin-table__cell--actions">
                                    <div className="admin-table__actions">
                                        <Select compact className="admin-bookings-page__status-select" value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value)}>
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}