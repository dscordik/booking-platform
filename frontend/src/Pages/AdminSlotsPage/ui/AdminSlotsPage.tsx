import * as React from "react";
import {useState} from "react";
import {
    getServices,
} from "../../../Entities/service";
import {createSlot, deleteSlot, getSlots} from "../../../Entities/slot";
import {Button} from "../../../Shared/ui/Button/Button";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {Input} from "../../../Shared/ui/Input/Input";
import {Select} from "../../../Shared/ui/Select/Select";
import {StatusBadge} from "../../../Shared/ui/StatusBadge/StatusBadge";
import {formatDateTime} from "../../../Shared/lib/format-date";
import "../../../Shared/ui/AdminPage/AdminPage.css";
import "../../../Shared/ui/Table/Table.css";
import "./AdminSlotsPage.css";
import {getErrorMessage} from "../../../Shared/lib/get-error-message";
import {useMutation, useQuery} from "@tanstack/react-query";
import {slotsKeys} from "../../../Entities/slot/model/query-keys.ts";
import {servicesKeys} from "../../../Entities/service/model/query-keys.ts";
import {queryClient} from "../../../Shared/lib/query-client.ts";

export const AdminSlotsPage:React.FC = () => {
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [formData, setFormData] = useState<{service_id?: number, start_at?: string, end_at?: string}>({})

    const {data: servicesData, error: servicesError} = useQuery({
        queryKey:servicesKeys.all,
        queryFn:() => getServices()
    })

    const { data: slotsData, isPending: slotsLoading, error: slotsError } = useQuery({
        queryKey:slotsKeys.all(selectedServiceId!, selectedDate),
        queryFn: () => getSlots(selectedServiceId!, selectedDate),
        enabled:selectedServiceId !== null
    })

    const {mutate:createSlotMutate, error:createError} = useMutation({
        mutationFn:(slotData:{service_id: number, start_at: string, end_at: string}) => createSlot(slotData),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:slotsKeys.all(selectedServiceId!, selectedDate)})
            setFormData({})
        }
    })

    const {mutate:deleteSlotMutate, error:deleteError} = useMutation({
        mutationFn:(id:number) => deleteSlot(id),
        onSuccess:() => queryClient.invalidateQueries({queryKey:slotsKeys.all(selectedServiceId!, selectedDate)})
    })

    function handleCreate() {
        if (!formData.start_at || !formData.end_at) {
            return
        }
        if (formData.end_at <= formData.start_at) {
            return
        }
        createSlotMutate({
            service_id:selectedServiceId!,
            start_at:formData.start_at,
            end_at:formData.end_at
        })
    }

    function handleDelete(id:number) {
        const confirmed = window.confirm('Вы действительно хотите удалить слот?')
        if (confirmed) {
            deleteSlotMutate(id)
        }
    }

    const currentError = servicesError || slotsError || createError || deleteError

    return (
        <div className="admin-page admin-slots-page">
            <div className="admin-page__header">
                <h2 className="admin-page__title">Управление слотами</h2>
            </div>
            <div className="admin-page__filters">
                <Select className="admin-page__filter" value={selectedServiceId ?? ''} onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">Выберите услугу</option>
                    {servicesData?.map(service => (
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
            {currentError && <p className="admin-page__error" role="alert">{getErrorMessage(currentError)}</p>}
            {!selectedServiceId ? (
                <div className="admin-page__empty">Выберите услугу для просмотра слотов</div>
            ) : slotsLoading ? (
                <Spinner text='Загрузка...'/>
            ) : !slotsData || slotsData?.length === 0 ? (
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
                        {slotsData?.map(slot => (
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