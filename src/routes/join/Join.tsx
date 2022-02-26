import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

import './join.scss';

import TEXT from '../../constants/TEXT.json';
import ROUTES from '../../constants/ROUTES.json';

import { UserContext } from "../../services/UserProvider";

function generateRoomId() {
    return Math.random().toString(36).substring(2,8);
}

export default function Join() {
    const { login } = useContext(UserContext);
    const { state } = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    useEffect(() => {
        if (room === '') {
            const isPreviousRoomIdExists = state && typeof  state === 'string';
            setRoom( isPreviousRoomIdExists ? state : generateRoomId() );
        }
    }, [room, state])

    return (
        <div className={'join__wrapper'}>
            <div className={'join__container'}>
                <h1 className="join__heading">{TEXT.Routes.Join.heading}</h1>

                <input placeholder={TEXT.Routes.Join.nameInput}
                       className="join__input"
                       type="text"
                       onChange={(event) => setName(event.target.value)} />
                <Link
                    onClick={event => (!name || !room) ? event.preventDefault() : null}
                    to={`/${ROUTES.chat}?room=${room}`}
                >
                    <button className="join__button"  onClick={() => login(name)} type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}