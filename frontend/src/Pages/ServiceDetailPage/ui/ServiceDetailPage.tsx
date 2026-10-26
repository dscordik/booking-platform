import * as React from "react";
import {Link, useParams} from "react-router-dom";
import "./ServiceDetailPage.css";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {SlotPicker} from "../../../Features/book-slot";
import {useQuery} from "@tanstack/react-query";
import {servicesKeys} from "../../../Entities/service/model/query-keys.ts";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";
import {getService} from "../../../Entities/service";
import axios from "axios";

export const ServiceDetailPage: React.FC = () => {
    const {id} = useParams()
    const serviceId = Number(id)
    const {data, isPending, error} = useQuery({
        queryKey:servicesKeys.detail(serviceId),
        queryFn:() => getService(serviceId),
        enabled: id !== undefined && !isNaN(serviceId),
        retry:false
    })
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404

    return (
        <div className="service-detail-page">
            <Link className="service-detail-page__back" to={'/services'}>← Назад в каталог</Link>
            {isPending && <Spinner text='Загрузка...'/>}
            {isNotFound && (
                <div className="service-detail-page__not-found"><p>Услуга не найдена</p></div>
            )}
            {error && !isNotFound && <div className="service-detail-page__error" role="alert">{getErrorMessage(error)}</div>}
            {!isPending && !isNotFound && !error && data && (
                <div className="service-detail">
                    <h2 className="service-detail__title">{data?.title}</h2>
                    <div className="service-detail__meta">
                        <span className="service-detail__price">{data?.price} ₽</span>
                        <span className="service-detail__duration">{data?.duration_min} мин</span>
                    </div>
                    {data?.description !== null && (
                        <p className="service-detail__description">{data.description}</p>
                    )}
                    <div className="service-detail__booking">
                        <SlotPicker serviceId={serviceId}/>
                    </div>
                </div>
            )}
        </div>
    )
}