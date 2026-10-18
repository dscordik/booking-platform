import * as React from "react";
import {useEffect, useState} from "react";
import {getService, type Service} from "../../../Entities/service";
import {Spinner} from "../../../Shared/ui/Spinner.tsx";
import {Link, useParams} from "react-router-dom";

export const ServiceDetailPage:React.FC = () => {
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
            } catch (err:any) {
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

    return(
        <div>
            {isLoading && <Spinner text='Загрузка...'/>}
            {notFound && <div>
                <p>Услуга не найдена</p>
                <Link to={'/services'}>Назад в каталог</Link>
            </div>}
            {error && <div>{error}</div>}
            {!isLoading && !notFound && !error && (
                <div>
                    {service && (
                        <div>
                            <p>{service.title}</p>
                            <p>{service.price}</p>
                            <p>{service.description}</p>
                            <p>{service.duration_min}</p>
                        </div>
                    )}
                    <section>Свободные места появятся здесь</section>
                </div>
            )}
        </div>
    )
}