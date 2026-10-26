import * as React from "react";
import {useState} from "react";
import {getAllBookings, updateBookingStatus} from "../../../Entities/booking";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {Select} from "../../../Shared/ui/Select/Select";
import {StatusBadge} from "../../../Shared/ui/StatusBadge/StatusBadge";
import {formatDateTime} from "../../../Shared/lib/format-date";
import "../../../Shared/ui/AdminPage/AdminPage.css";
import "../../../Shared/ui/Table/Table.css";
import "./AdminBookingsPage.css";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {servicesKeys} from "../../../Entities/service/model/query-keys.ts";
import {getServices} from "../../../Entities/service";
import {bookingsKeys} from "../../../Entities/booking/model/query-keys.ts";
import {queryClient} from "../../../Shared/lib/query-client.ts";
import type {BookingStatus} from "../../../Entities/booking/model/types.ts";

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Ожидает' },
    { value: 'confirmed', label: 'Подтверждена' },
    { value: 'cancelled', label: 'Отменена' },
    { value: 'done', label: 'Выполнена' },
]

export const AdminBookingsPage:React.FC = () => {
    const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('')
    const [filteredServiceId, setFilteredServiceId] = useState<number | null>(null)

    const {data: servicesData, error: servicesError} = useQuery({
        queryKey:servicesKeys.all,
        queryFn:() => getServices()
    })

    const { data: bookingsData, isPending: bookingsLoading, error: bookingsError } = useQuery({
        queryKey: bookingsKeys.admin(filterStatus || undefined, filteredServiceId || undefined),
        queryFn:() => getAllBookings({service_id:filteredServiceId || undefined, status:filterStatus || undefined})
    })

    const { mutate: changeStatusMutate, error: statusChangeError } = useMutation({
        mutationFn:({id, status}:{id:number, status:BookingStatus}) => updateBookingStatus(id, status),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:['bookings', 'admin']})
        }
    })

    function handleStatusChange(id: number, newStatus: BookingStatus) {
        const confirm = window.confirm('Вы действительно хотите изменить статус записи?')
        if (confirm) {
            changeStatusMutate({id,status:newStatus})
        }
    }

    const currentError = servicesError || statusChangeError || bookingsError

    return (
        <div className="admin-page admin-bookings-page">
            <div className="admin-page__header"><h2 className="admin-page__title">Управление записями</h2></div>
            <div className="admin-page__filters">
                <Select className="admin-page__filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BookingStatus)}>
                    <option value="">Все статусы</option>
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
                <Select className="admin-page__filter" value={filteredServiceId ?? ''} onChange={(e) => setFilteredServiceId(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">Все услуги</option>
                    {servicesData?.map(service => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                </Select>
            </div>
            {currentError && <p className="admin-page__error" role="alert">{getErrorMessage(currentError)}</p>}
            {bookingsLoading ? <Spinner text='Загрузка...'/> : !bookingsData || bookingsData.length === 0 ? (
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
                        {bookingsData.map(booking => (
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
                                        <Select compact className="admin-bookings-page__status-select" value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}>
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