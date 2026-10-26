import * as React from "react";
import {useState} from "react";
import {
    createService,
    deleteService,
    getServices,
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
import {getErrorMessage} from "../../../Shared/lib/get-error-message";
import {useMutation, useQuery} from "@tanstack/react-query";
import {servicesKeys} from "../../../Entities/service/model/query-keys.ts";
import {queryClient} from "../../../Shared/lib/query-client.ts";

export const AdminServicesPage:React.FC = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Partial<ServiceCreate>>({})

    const {data, isPending, error:queryError} = useQuery({
        queryKey:servicesKeys.all,
        queryFn:() => getServices()
    })

    const {mutate:createServiceMutate, error:createError} = useMutation({
        mutationFn:(service:ServiceCreate) => createService(service),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:servicesKeys.all})
            setIsCreating(false)
            setFormData({})
        }
    })

    const {mutate:updateServiceMutate, error:updateError} = useMutation({
        mutationFn:({id, service}:{id:number, service:Partial<ServiceCreate>}) => updateService(id, service),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:servicesKeys.all})
            setEditingId(null)
        }
    })

    const {mutate:deleteServiceMutate, error:deleteError} = useMutation({
        mutationFn:(id:number) => deleteService(id),
        onSuccess:() => queryClient.invalidateQueries({queryKey:servicesKeys.all})
    })

    function handleCreate() {
        if (!formData.title || !formData.duration_min || !formData.price){
            return
        }
        createServiceMutate(formData as ServiceCreate)
    }

    function handleUpdate(id:number) {
        const confirmed = window.confirm('Вы действительно хотите изменить эту  услугу?')
        if (confirmed) {
            updateServiceMutate({id, service:formData})
        }
    }

    function handleDelete(id:number) {
        const confirmed = window.confirm('Вы действительно хотите удалить эту  услугу?')
        if (confirmed) {
            deleteServiceMutate(id)
        }
    }

    const currentError = queryError || createError || updateError || deleteError

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
            {currentError && <p className="admin-page__error" role="alert">{getErrorMessage(currentError)}</p>}
            {isPending ? <Spinner text='Загрузка...'/> : !data || data.length === 0 ? (
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
                        {data.map((service) => (
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