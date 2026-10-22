import * as React from "react";
import "./StatusBadge.css";

type StatusBadgeVariant =
    | 'pending' | 'confirmed' | 'cancelled' | 'done'
    | 'active' | 'inactive'
    | 'free' | 'busy'

interface StatusBadgeProps {
    variant: StatusBadgeVariant,
    children: React.ReactNode
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({variant, children}) => {
    return (
        <span className={`status-badge status-badge--${variant}`}>
            {children}
        </span>
    )
}