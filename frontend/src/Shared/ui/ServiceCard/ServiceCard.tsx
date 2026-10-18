import type {Service} from "../../../Entities/service";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import "./ServiceCard.css";

interface ServiceCardProps {
    service: Service
}

export const ServiceCard: React.FC<ServiceCardProps> = ({service}) => {
    const navigate = useNavigate()

    function handleClick() {
        navigate(`/services/${service.id}`)
    }

    return (
        <div className="service-card" onClick={handleClick}>
            <h3 className="service-card__title">{service.title}</h3>
            <div className="service-card__meta">
                <span className="service-card__duration">{service.duration_min} мин</span>
                <span className="service-card__price">{service.price} ₽</span>
            </div>
            {service.description !== null && (
                <p className="service-card__description">{service.description}</p>
            )}
        </div>
    )
}