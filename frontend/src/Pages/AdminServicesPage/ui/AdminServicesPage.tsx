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

export const AdminServicesPage:React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(false)
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
            await createService(formData)
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
        const confirmed = window.confirm('Вы действительно хотите отменить запись?')
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
        <div>
            {isLoading ? <Spinner text='Загрузка...'/> : (
                <div>
                    <div className="admin-page__header">
                        <h1>Управление услугами</h1>
                        {!isCreating && <Button onClick={() => setIsCreating(true)}>Добавить услугу</Button>}
                    </div>
                    {isCreating && (
                        <form className="admin-page__form">
                            <Input placeholder="Название" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                            <Input placeholder="Длительность (мин)" type="number" value={formData.duration_min} onChange={(e) => setFormData({...formData, duration_min: Number(e.target.value)})}/>
                            <Input placeholder="Цена" type="number" value={formData.price} onChange={(e) =>setFormData({...formData, price: Number(e.target.value)})}/>
                            <Button onClick={handleCreate}>Сохранить</Button>
                            <Button variant="secondary" onClick={() => {setIsCreating(false); setFormData({})}}>Отмена</Button>
                        </form>
                    )}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {services.length === 0 ? (
                        <div>Услуг нет</div>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Длительность</th>
                                    <th>Цена</th>
                                    <th>Активна</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {services.map((service) => (
                                    <tr key={service.id}>
                                        {editingId === service.id ? (
                                            <>
                                                <td><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/></td>
                                                <td><Input type="number" value={formData.duration_min} onChange={(e) => setFormData({...formData, duration_min: Number(e.target.value)})}/></td>
                                                <td><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}/></td>
                                                <td>{service.is_active ? 'Да' : 'Нет'}</td>
                                                <td className="admin-table__actions">
                                                    <Button onClick={() => handleUpdate(service.id)}>Сохранить</Button>
                                                    <Button variant="secondary" onClick={() => setEditingId(null)}>Отмена</Button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{service.title}</td>
                                                <td>{service.duration_min} мин</td>
                                                <td>{service.price} Р</td>
                                                <td>{service.is_active ? 'Да' : 'Нет'}</td>
                                                <td className="admin-table__actions">
                                                    <Button variant="secondary" onClick={() => {
                                                        setEditingId(service.id);
                                                        setFormData({title: service.title, duration_min: service.duration_min, price: service.price});
                                                    }}>Редактировать</Button>
                                                    <Button variant="danger" onClick={() => handleDelete(service.id)}>Удалить</Button>
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
            )}
        </div>
    )
}