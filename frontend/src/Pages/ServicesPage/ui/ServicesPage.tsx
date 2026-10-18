import * as React from "react";
import {useEffect, useState} from "react";
import {getServices, type Service} from "../../../Entities/service";
import {Spinner} from "../../../Shared/ui/Spinner";
import {ServiceCard} from "../../../Shared/ui/ServiceCard";


export const ServicesPage:React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadServices() {
            try {
                setIsLoading(true)
                const curServices = await getServices()
                setServices(curServices)
            } catch (err) {
                if(err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        loadServices()
    }, []);

    return(
        <div>
            {isLoading && <Spinner text='Загрузка услуг...'/>}
            {error && <div>{error}</div>}
            {!isLoading && !error && (
                services.length === 0 ? (
                    <div>В данный момент не доступных услуг</div>
                ) : (
                    <div>
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service}/>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}