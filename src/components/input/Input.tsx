import  React from 'react';
import {OwnProps} from "./types";

import "./input.scss";

import TEXT from '../../constants/TEXT.json'

export default function Input({message, setMessage, sendMessage}: OwnProps) {
    return (
        <form className="form">
            <input
                className="form__input"
                type="text"
                placeholder={TEXT.Routes.Chat.textInput}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} />
            <button className="form__button_send" onClick={(event) => sendMessage(event)}>Send</button>
        </form>
    )
}