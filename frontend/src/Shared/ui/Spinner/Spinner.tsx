import * as React from "react";
import "./Spinner.css";

interface SpinnerProps {
    text?: string
}

export const Spinner: React.FC<SpinnerProps> = ({text}) => {
    return (
        <div className="spinner">
            <div className="spinner__circle"/>
            {text && (<div className="spinner__text">{text}</div>)}
        </div>
    )
}