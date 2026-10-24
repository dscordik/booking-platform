import * as React from "react";
import {useEffect, useState} from "react";
import {getService, type Service} from "../../../Entities/service";
import {Link, useParams} from "react-router-dom";
import "./ServiceDetailPage.css";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {SlotPicker} from "../../../Features/book-slot";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import axios from "axios";

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
                setError(null)
                const curService = await getService(Number(id))
                setService(curService)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setNotFound(true)
                } else {
                    setError(getErrorMessage(error))
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
                <div className="service-detail-page__not-found"><p>Услуга не найдена</p></div>
            )}
            {error && <div className="service-detail-page__error" role="alert">{error}</div>}
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
                    <div className="service-detail__booking">
                        <SlotPicker serviceId={Number(id)}/>
                    </div>
                </div>
            )}
        </div>
    )
}