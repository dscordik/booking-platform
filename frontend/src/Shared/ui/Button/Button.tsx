import * as React from "react";
import "./Button.css";

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant,
    size?: ButtonSize,
    fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...rest}) => {
    const classes = [
        'button',
        `button--${variant}`,
        size === 'sm' ? 'button--sm' : '',
        fullWidth ? 'button--full' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}