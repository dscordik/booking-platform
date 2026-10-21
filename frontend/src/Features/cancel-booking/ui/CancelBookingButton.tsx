import {useCancelBooking} from "../model/use-cancel-booking";
import * as React from "react";
import {Button} from "../../../Shared/ui/Button/Button.tsx";


interface CancelBookingButtonProps{
    id:number,
    onSuccess: () => void
}

export const CancelBookingButton:React.FC<CancelBookingButtonProps> = ({id, onSuccess}) => {
    const {isLoading, handleSubmit} = useCancelBooking()

    async function handleClick() {
        const result = window.confirm('Вы действительно хотите отменить запись?')
        if (!result) {
            return
        }
        const success = await handleSubmit(id)
        if (success) {
            onSuccess()
        }
    }
    return(
        <Button variant="danger" size="sm" disabled={isLoading} onClick={() => handleClick()}>{isLoading ? 'Отменяем...' : 'Отменить бронь'}</Button>
    )
}