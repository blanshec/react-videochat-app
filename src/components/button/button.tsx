import React from "react";

type OwnProps = {
    buttonLabel: string,
    callback: () => void
}


export default function Button({buttonLabel, callback}: OwnProps) {
    return (
        <button onClick={callback}>{buttonLabel}</button>
    )
}