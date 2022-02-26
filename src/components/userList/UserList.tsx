import  React from 'react';
import {OwnProps} from "./types";

import './userList.scss';

export default function UserList({users}: OwnProps) {
    return (
        <div className="user-list">
            <h2>Created with tears for your enjoyment</h2>
            { users ? (
                <>
                    <h3>People currently chatting:</h3>
                    <div className="active-container">
                        <p>
                            {users.map((name) => (
                                <span key={name} className="active-user">
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