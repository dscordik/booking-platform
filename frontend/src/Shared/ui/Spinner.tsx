import * as React from "react";

interface SpinnerProps{
    text?:string
}

export const Spinner:React.FC<SpinnerProps> = ({text}) => {
    return(
        <div>
            {text && (<div>{text}</div>)}
        </div>
    )
}