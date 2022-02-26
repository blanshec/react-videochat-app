import React from 'react';

import './message.scss';

import {OwnProps} from "./types";

function Message({message: {user, text}, username}: OwnProps) {
    let isSentByCurrentUser = false;
    const trimmedName = username.trim().toLowerCase();

    if (user === trimmedName) {
        isSentByCurrentUser = true;
    }

    return ( isSentByCurrentUser
            ? (
                <div className="message__container_current-user">
                    <p className="sent-text">{username}</p>
                    <div className="message__box_current-user">
                        <p className="message__text_current-user">{text}</p>
                        <p className="message__timestamp_current-user">{`${new Date().getHours()}:${new Date().getMinutes()}`}</p>
                    </div>
                </div>
            )
            : (
                <div className="message__container_other-user">
                    <div className="message__box_other-user">
                        <p className="message__text_other-user">{text}</p>
                        <p className="message__timestamp_other-user">{`${new Date().getHours()}:${new Date().getMinutes()}`}</p>
                    </div>
                    <p className="sent-text">{user}</p>
                </div>
            )
    );
}

export default Message;

// TODO
// Этот чертов баг с обновлющимся временем в каждом сообщении.
// Думаю его можно решить если отправлять таймстемп на сервер вместе с остальными данными сообщения