import type {Service} from "../../Entities/service";
import * as React from "react";
import {useNavigate} from "react-router-dom";

interface ServiceCardProps{
    service:Service
}

export const ServiceCard:React.FC<ServiceCardProps> = ({service}) => {
    const navigate = useNavigate()

    function handleClick() {
        navigate(`/services/${service.id}`)
    }

    return(
        <div onClick={() => handleClick()}>
            <h3>Название: {service.title}</h3>
            <span>Длительность: {service.duration_min} мин</span>
            <span>Цена: {service.price} Р</span>
            {service.description !== null && (<p>{service.description}</p>)}
        </div>
    )
}