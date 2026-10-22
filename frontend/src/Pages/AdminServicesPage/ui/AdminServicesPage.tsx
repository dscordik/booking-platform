import * as React from "react";
import {useEffect, useState} from "react";
import {
    createService,
    deleteService,
    getServices,
    type Service,
    type ServiceCreate,
    updateService
} from "../../../Entities/service";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {Input} from "../../../Shared/ui/Input/Input";
import {Button} from "../../../Shared/ui/Button/Button";
import {StatusBadge} from "../../../Shared/ui/StatusBadge/StatusBadge";
import "../../../Shared/ui/AdminPage/AdminPage.css";
import "../../../Shared/ui/Table/Table.css";
import "./AdminServicesPage.css";

export const AdminServicesPage:React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Partial<ServiceCreate>>({})

    useEffect(() => {
        loadServices()
    }, []);

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

    async function handleCreate() {
        if (!formData.title || !formData.duration_min || !formData.price) {
            return
        }
        try {
            await createService(formData as ServiceCreate)
            await loadServices()
            setIsCreating(false)
            setFormData({})
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    async function handleUpdate(id:number) {
        try {
            await updateService(id, formData)
            await loadServices()
            setEditingId(null)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    async function handleDelete(id:number) {
        const confirmed = window.confirm('Вы действительно хотите удалить услугу?')
        if (!confirmed) {
            return
        }
        try {
            await deleteService(id)
            await loadServices()
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
        }
    }

    return(
        <div className="admin-page admin-services-page">
            <div className="admin-page__header">
                <h2 className="admin-page__title">Управление услугами</h2>
                {!isCreating && <Button onClick={() => setIsCreating(true)}>Добавить услугу</Button>}
            </div>
            {isCreating && (
                <form className="admin-page__form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
                    <label className="admin-page__field">
                        <span className="admin-page__label">Название</span>
                        <Input placeholder="Название" value={formData.title ?? ''} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                    </label>
                    <label className="admin-page__field">
                        <span className="admin-page__label">Длительность (мин)</span>
                        <Input placeholder="60" type="number" value={formData.duration_min ?? ''} onChange={(e) => setFormData({...formData, duration_min: Number(e.target.value)})}/>
                    </label>
                    <label className="admin-page__field">
                        <span className="admin-page__label">Цена, ₽</span>
                        <Input placeholder="3000" type="number" value={formData.price ?? ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}/>
                    </label>
                    <div className="admin-page__form-actions">
                        <Button type="submit">Сохранить</Button>
                        <Button type="button" variant="secondary" onClick={() => {setIsCreating(false); setFormData({})}}>Отмена</Button>
                    </div>
                </form>
            )}
            {error && <p className="admin-page__error" role="alert">{error}</p>}
            {isLoading ? <Spinner text='Загрузка...'/> : services.length === 0 ? (
                <div className="admin-page__empty">Услуг пока нет</div>
            ) : (
                <div className="admin-table">
                    <table className="admin-table__table">
                        <thead>
                        <tr>
                            <th className="admin-table__head-cell">Название</th>
                            <th className="admin-table__head-cell">Длительность</th>
                            <th className="admin-table__head-cell">Цена</th>
                            <th className="admin-table__head-cell">Активна</th>
                            <th className="admin-table__head-cell admin-table__head-cell--actions">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map((service) => (
                            <tr className="admin-table__row" key={service.id}>
                                {editingId === service.id ? (
                                    <>
                                        <td className="admin-table__cell">
                                            <Input compact className="admin-services-page__input-title" value={formData.title ?? ''} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                                        </td>
                                        <td className="admin-table__cell">
                                            <Input compact className="admin-services-page__input-number" type="number" value={formData.duration_min ?? ''} onChange={(e) => setFormData({...formData, duration_min: Number(e.target.value)})}/>
                                        </td>
                                        <td className="admin-table__cell">
                                            <Input compact className="admin-services-page__input-number" type="number" value={formData.price ?? ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}/>
                                        </td>
                                        <td className="admin-table__cell">
                                            <StatusBadge variant={service.is_active ? 'active' : 'inactive'}>{service.is_active ? 'Да' : 'Нет'}</StatusBadge>
                                        </td>
                                        <td className="admin-table__cell admin-table__cell--actions">
                                            <div className="admin-table__actions">
                                                <Button size="sm" onClick={() => handleUpdate(service.id)}>Сохранить</Button>
                                                <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Отмена</Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="admin-table__cell admin-table__cell--strong">{service.title}</td>
                                        <td className="admin-table__cell admin-table__cell--nowrap">{service.duration_min} мин</td>
                                        <td className="admin-table__cell admin-table__cell--nowrap">{service.price} ₽</td>
                                        <td className="admin-table__cell">
                                            <StatusBadge variant={service.is_active ? 'active' : 'inactive'}>{service.is_active ? 'Да' : 'Нет'}</StatusBadge>
                                        </td>
                                        <td className="admin-table__cell admin-table__cell--actions">
                                            <div className="admin-table__actions">
                                                <Button size="sm" variant="secondary" onClick={() => {setEditingId(service.id);setFormData({title: service.title, duration_min: service.duration_min, price: service.price});}}>Редактировать</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(service.id)}>Удалить</Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}