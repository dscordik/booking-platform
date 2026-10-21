import {cancelBooking} from "../../../Entities/booking";
import {useState} from "react";

export const useCancelBooking = () => {
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(id:number) {
        setIsLoading(true)
        try {
            await cancelBooking(id)
            return true
        } catch {
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {isLoading, handleSubmit}
}