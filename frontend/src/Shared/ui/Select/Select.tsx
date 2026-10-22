import * as React from "react";
import "./Select.css";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    compact?: boolean
}

export const Select: React.FC<SelectProps> = ({compact = false, className = '', children, ...rest}) => {
    const classes = ['select', compact ? 'select--sm' : '', className].filter(Boolean).join(' ')
    return (
        <select className={classes} {...rest}>
            {children}
        </select>
    )
}