import  React from 'react';
import {OwnProps} from "./types";
import {Link} from "react-router-dom";

import './chatHeader.scss';

import {ReactComponent as Close} from '../../icons/close.svg';

export default function ChatHeader({room}: OwnProps) {
    return (
        <div className={'chat-header__wrapper'}>
            <h3 className={'chat-header__heading'}>{room}</h3>
            <Link to={'/'} ><Close className={'close-icon'}/></Link>
        </div>
    );
}