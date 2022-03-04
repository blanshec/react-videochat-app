import  React from 'react';
import {OwnProps} from "./types";

import './userList.scss';

export default function UserList({users}: OwnProps) {
    return (
        <div className="user-list">
            { users ? (
                <>
                    <h3>People currently chatting:</h3>
                    <div className="active-container">
                        <p>
                            {users.map((name) => (
                                <span key={name} className="active-user" style={{color: 'rgb(random(255), random(255), random(255)'}}>
                                    {name}
                                </span>
                            ))}
                        </p>
                    </div>
                </>
                )
                : null
            }
        </div>
    );
}