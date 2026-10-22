import * as React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    compact?: boolean
}

export const Input: React.FC<InputProps> = ({compact = false, className = '', ...rest}) => {
    const classes = ['input', compact ? 'input--sm' : '', className].filter(Boolean).join(' ')
    return <input className={classes} {...rest}/>
}