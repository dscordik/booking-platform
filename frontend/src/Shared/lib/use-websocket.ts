import {useEffect, useState} from "react";
import {getToken} from "./token-storage.ts";
import {bookingsKeys} from "../../Entities/booking/model/query-keys.ts";
import {queryClient} from "./query-client.ts";

export type WebsocketStatus = 'connecting' | 'connected' | 'disconnected'

export function useWebsocket(userId?:number | null) {
    const [status, setStatus] = useState<WebsocketStatus>('disconnected')

    const minDelay = 1000
    const maxDelay = 15000

    useEffect(() => {
        if (!userId) {
            return
        }
        let timer:ReturnType<typeof setTimeout> | undefined
        let delay = minDelay
        let socket:WebSocket | null = null
        let stopped = false
        try {
            const token = getToken()
            if (!token) {
                return
            }
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
            setStatus('connecting')
            const wsUrl = baseUrl.replace('http', 'ws') + `/ws?token=` + token
            const connect = () => {
                socket = new WebSocket(wsUrl)
                socket.onopen = () => {
                    delay = minDelay
                    setStatus('connected')
                }
                socket.onmessage = (e) => {
                    const data = JSON.parse(e.data)
                    switch (data.type) {
                        case 'booking_created':
                        case 'booking_cancelled':
                            queryClient.invalidateQueries({queryKey:['bookings', 'admin']})
                            break
                        case 'booking_status_changed':
                            queryClient.invalidateQueries({queryKey:bookingsKeys.me})
                            queryClient.invalidateQueries({queryKey: ['bookings', 'admin']})
                            break
                        case 'slot_occupancy_changed':
                            queryClient.invalidateQueries({queryKey:['slots']})
                            break
                    }
                }
                socket.onclose = (e) => {
                    if (stopped) {
                        return
                    }
                    setStatus('disconnected')
                    if (e.code === 1008) {
                        return;
                    }
                    delay = Math.min(delay * 2, maxDelay)
                    timer = setTimeout(() => {connect()}, delay)
                }
            }

            timer = setTimeout(connect, 0)
            return () => {
                stopped = true
                clearTimeout(timer)
                if (socket) {
                    socket.close()
                }
            }
        } catch (error) {
            console.error("WebSocket setup error:", error)
        }
    }, [userId]);

    return {status: (userId ? status : 'disconnected') as WebsocketStatus}
}