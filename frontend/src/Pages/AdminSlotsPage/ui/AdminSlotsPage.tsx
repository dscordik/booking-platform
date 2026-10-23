import * as React from "react";
import {useEffect, useState} from "react";
import {getServices, type Service} from "../../../Entities/service";
import {createSlot, deleteSlot, getSlots, type SlotOut} from "../../../Entities/slot";
import {Button} from "../../../Shared/ui/Button/Button";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {Input} from "../../../Shared/ui/Input/Input";
import {Select} from "../../../Shared/ui/Select/Select";
import {StatusBadge} from "../../../Shared/ui/StatusBadge/StatusBadge";
import {formatDateTime} from "../../../Shared/lib/format-date";
import "../../../Shared/ui/AdminPage/AdminPage.css";
import "../../../Shared/ui/Table/Table.css";
import "./AdminSlotsPage.css";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";

export const AdminSlotsPage:React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [slots, setSlots] = useState<SlotOut[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<{service_id?: number, start_at?: string, end_at?: string}>({})

    useEffect(() => {
        loadServices()
    }, []);

    useEffect(() => {
        loadSlots(selectedServiceId,selectedDate)
    }, [selectedServiceId, selectedDate]);

    async function loadServices() {
        try {
            const currentServices = await getServices()
            setServices(currentServices)
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    async function loadSlots(serviceId:number | null, date?:string) {
        if (!serviceId) {
            setSlots([])
            return
        }
        setIsLoading(true)
        try {
            const currentSlots = await getSlots(serviceId, date || undefined)
            setSlots(currentSlots)
        } catch (error) {
            setError(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCreate() {
        if (!formData.start_at || !formData.end_at) {
            return
        }
        if (formData.end_at <= formData.start_at) {
            return
        }
        try {
            await createSlot({
                service_id:selectedServiceId!,
                start_at:formData.start_at,
                end_at:formData.end_at
            })
            await loadSlots(selectedServiceId, selectedDate)
            setFormData({})
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    async function handleDelete(id:number) {
        const confirmed = window.confirm('Вы действительно хотите удалить слот?')
        if (!confirmed) {
            return
        }
        try {
            await deleteSlot(id)
            await loadSlots(selectedServiceId, selectedDate)
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    return (
        <div className="admin-page admin-slots-page">
            <div className="admin-page__header">
                <h2 className="admin-page__title">Управление слотами</h2>
            </div>
            <div className="admin-page__filters">
                <Select className="admin-page__filter" value={selectedServiceId ?? ''} onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">Выберите услугу</option>
                    {services.map(service => (
                        <option key={service.id} value={String(service.id)}>{service.title}</option>
                    ))}
                </Select>
                <Input className="admin-slots-page__date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
            </div>
            {selectedServiceId && (
                <form className="admin-page__form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
                    <label className="admin-page__field">
                        <span className="admin-page__label">Начало</span>
                        <Input type="datetime-local" value={formData.start_at ?? ''} onChange={(e) => setFormData({...formData, start_at: e.target.value})}/>
                    </label>
                    <label className="admin-page__field">
                        <span className="admin-page__label">Окончание</span>
                        <Input type="datetime-local" value={formData.end_at ?? ''} onChange={(e) => setFormData({...formData, end_at: e.target.value})}/>
                    </label>
                    <div className="admin-page__form-actions">
                        <Button type="submit">Создать слот</Button>
                    </div>
                </form>
            )}
            {error && <p className="admin-page__error" role="alert">{error}</p>}
            {!selectedServiceId ? (
                <div className="admin-page__empty">Выберите услугу для просмотра слотов</div>
            ) : isLoading ? (
                <Spinner text='Загрузка...'/>
            ) : slots.length === 0 ? (
                <div className="admin-page__empty">Слотов нет</div>
            ) : (
                <div className="admin-table">
                    <table className="admin-table__table">
                        <thead>
                        <tr>
                            <th className="admin-table__head-cell">Время начала</th>
                            <th className="admin-table__head-cell">Время окончания</th>
                            <th className="admin-table__head-cell">Статус</th>
                            <th className="admin-table__head-cell admin-table__head-cell--actions">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {slots.map(slot => (
                            <tr className="admin-table__row" key={slot.id}>
                                <td className="admin-table__cell admin-table__cell--strong admin-table__cell--nowrap">{formatDateTime(slot.start_at)}</td>
                                <td className="admin-table__cell admin-table__cell--muted admin-table__cell--nowrap">{formatDateTime(slot.end_at)}</td>
                                <td className="admin-table__cell">
                                    <StatusBadge variant={slot.is_booked ? 'busy' : 'free'}>{slot.is_booked ? 'Занят' : 'Свободен'}</StatusBadge>
                                </td>
                                <td className="admin-table__cell admin-table__cell--actions">
                                    <div className="admin-table__actions">
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(slot.id)} disabled={slot.is_booked}>Удалить</Button>
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