import React from 'react';
import Message from "../message";

import {OwnProps} from "./types";

function MessageBoard(data: OwnProps) {
    return (
        <div>
            {data.messages.map(
                (message: {user: string, text: string}, iterator: number) => <div key={iterator}><Message message={message} username={data.username}/></div>
            )}
        </div>
    );
}

export default MessageBoard;