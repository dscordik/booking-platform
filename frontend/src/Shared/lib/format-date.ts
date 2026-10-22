export function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    })
}