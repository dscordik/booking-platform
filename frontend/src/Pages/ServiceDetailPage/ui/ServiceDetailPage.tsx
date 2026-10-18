import * as React from "react";
import {useEffect, useState} from "react";
import {getService, type Service} from "../../../Entities/service";
import {Link, useParams} from "react-router-dom";
import "./ServiceDetailPage.css";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner.tsx";

export const ServiceDetailPage: React.FC = () => {
    const [service, setService] = useState<Service | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)
    const {id} = useParams()

    useEffect(() => {
        async function loadService() {
            try {
                setIsLoading(true)
                setNotFound(false)
                const curService = await getService(Number(id))
                setService(curService)
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    setNotFound(true)
                } else if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        loadService()
    }, [id]);

    return (
        <div className="service-detail-page">
            <Link className="service-detail-page__back" to={'/services'}>← Назад в каталог</Link>
            {isLoading && <Spinner text='Загрузка...'/>}
            {notFound && (
                <div className="not-found">
                    <p>Услуга не найдена</p>
                </div>
            )}
            {error && <div className="services-page__error">{error}</div>}
            {!isLoading && !notFound && !error && service && (
                <div className="service-detail">
                    <h2 className="service-detail__title">{service.title}</h2>
                    <div className="service-detail__meta">
                        <span className="service-detail__price">{service.price} ₽</span>
                        <span className="service-detail__duration">{service.duration_min} мин</span>
                    </div>
                    {service.description !== null && (
                        <p className="service-detail__description">{service.description}</p>
                    )}
                    <section className="service-detail__slots">Свободные места появятся здесь</section>
                </div>
            )}
        </div>
    )
}