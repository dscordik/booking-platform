import axios from "axios";

export function getErrorMessage(error:unknown, fallback = 'Что-то пошло не так, попробуйте еще раз') {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'Нет связи с сервером. Проверьте интернет-соединение и попробуйте снова'
        }
        if (typeof error?.response?.data?.detail === 'string') {
            return error.response.data.detail
        } else {
            return fallback
        }
    }
    if (error instanceof Error) {
        return error.message
    } else {
        return fallback
    }
}