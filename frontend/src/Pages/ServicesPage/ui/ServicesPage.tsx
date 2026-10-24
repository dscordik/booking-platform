import * as React from "react";
import {useEffect, useState} from "react";
import {getServices, type Service} from "../../../Entities/service";
import "./ServicesPage.css";
import {ServiceCard} from "../../../Shared/ui/ServiceCard/ServiceCard";
import {Spinner} from "../../../Shared/ui/Spinner/Spinner";
import {getErrorMessage} from "../../../Shared/lib/get-error-message.ts";

export const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadServices() {
            try {
                setIsLoading(true)
                const curServices = await getServices()
                setServices(curServices)
            }  catch (error) {
                setError(getErrorMessage(error))
            } finally {
                setIsLoading(false)
            }
        }
        loadServices()
    }, []);

    return (
        <div className="services-page">
            <h2 className="services-page__heading">Каталог услуг</h2>
            {isLoading && <Spinner text='Загрузка услуг...'/>}
            {error && <div className="services-page__error" role="alert">{error}</div>}
            {!isLoading && !error && (
                services.length === 0 ? (
                    <div className="services-page__empty">В данный момент нет доступных услуг</div>
                ) : (
                    <div className="services-page__grid">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service}/>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}