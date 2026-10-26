import * as React from "react";
import "./ServicesPage.css";
import {ServiceCard} from "../../../Shared/ui/ServiceCard/ServiceCard";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {useQuery} from "@tanstack/react-query";
import {servicesKeys} from "../../../Entities/service/model/query-keys.ts";
import {getServices} from "../../../Entities/service";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";

export const ServicesPage: React.FC = () => {
    const {data, isPending, error} = useQuery({
        queryKey:servicesKeys.all,
        queryFn:() => getServices()
    })

    return (
        <div className="services-page">
            <h2 className="services-page__heading">Каталог услуг</h2>
            {isPending && <Spinner text='Загрузка услуг...'/>}
            {error && <div className="services-page__error" role="alert">{getErrorMessage(error)}</div>}
            {!isPending && !error && (
                !data || data.length === 0 ? (
                    <div className="services-page__empty">В данный момент нет доступных услуг</div>
                ) : (
                    <div className="services-page__grid">
                        {data?.map((service) => (
                            <ServiceCard key={service.id} service={service}/>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}