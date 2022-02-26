import React from "react";

export type OwnProps = {
    message: string,
    setMessage: (value: string) => void,
    sendMessage: (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => void,
};