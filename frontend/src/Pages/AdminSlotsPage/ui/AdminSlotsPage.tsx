import * as React from "react";
import {useEffect, useState} from "react";
import {getServices, type Service} from "../../../Entities/service";
import {createSlot, deleteSlot, getSlots, type SlotOut} from "../../../Entities/slot";
import { Button } from "../../../Shared/ui/Button/Button";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner.tsx";
import {Input} from "../../../Shared/ui/Input/Input.tsx";


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

    async function loadSlots(serviceId:number | null, date?:string) {
        if (!serviceId) {
            setSlots([])
            return
        }
        setIsLoading(true)
        try {
            const currentSlots = await getSlots(serviceId, date || undefined)
            setSlots(currentSlots)
        }  catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
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
            if (error instanceof Error) {
                setError(error.message)
            }
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
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
        }
    }

    return (
        <div>
            {isLoading ? <Spinner text='Загрузка...'/> : (
                <div>
                    <div className="admin-page__header"><h1>Управление слотами</h1></div>
                    <div className="admin-page__filters">
                        <select value={selectedServiceId ?? ''} onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">Выберите услугу</option>
                            {services.map(service => (
                                <option key={service.id} value={String(service.id)}>{service.title}</option>
                            ))}
                        </select>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
                    </div>
                    {selectedServiceId && (
                        <form className="admin-page__form">
                            <Input type="datetime-local" placeholder="Начало" value={formData.start_at ?? ''} onChange={(e) => setFormData({...formData, start_at: e.target.value})}/>
                            <Input type="datetime-local" placeholder="Окончание" value={formData.end_at ?? ''} onChange={(e) => setFormData({...formData, end_at: e.target.value})}/>
                            <Button onClick={handleCreate}>Создать слот</Button>
                        </form>
                    )}
                    {error && <p>{error}</p>}
                    {!selectedServiceId ? (
                        <div>Выберите услугу для просмотра слотов</div>
                    ) : slots.length === 0 ? (
                        <div>Слотов нет</div>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>Время начала</th>
                                    <th>Время окончания</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {slots.map(slot => (
                                    <tr key={slot.id}>
                                        <td>{new Date(slot.start_at).toLocaleString()}</td>
                                        <td>{new Date(slot.end_at).toLocaleString()}</td>
                                        <td>{slot.is_booked ? 'Занят' : 'Свободен'}</td>
                                        <td className="admin-table__actions">
                                            <Button variant="danger" onClick={() => handleDelete(slot.id)} disabled={slot.is_booked}>Удалить</Button>
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