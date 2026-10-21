import * as React from "react";
import "./Input.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({className = '', ...rest}) => {
    return <input className={`input ${className}`.trim()} {...rest}/>
}