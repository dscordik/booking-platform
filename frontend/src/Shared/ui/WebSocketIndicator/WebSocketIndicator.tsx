import * as React from "react";
import type {WebsocketStatus} from "../../lib/use-websocket.ts";
import './WebSocketIndicator.css'

interface WebSocketIndicatorProps{
    status:WebsocketStatus
}

const labels:Record<WebsocketStatus, string> = {
    connecting: 'Подключение',
    connected: 'На связи',
    disconnected: 'Нет связи'
}

export const WebSocketIndicator:React.FC<WebSocketIndicatorProps> = ({status}) => {
    return(
        <span className={`ws-indicator ws-indicator--${status}`} title={labels[status]} role="status">
            <span className="ws-indicator__dot" aria-hidden="true"/>
            <span className="ws-indicator__label">{labels[status]}</span>
        </span>
    )
}