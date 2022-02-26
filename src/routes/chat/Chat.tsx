import React, {useContext, useEffect, useState, useCallback, MutableRefObject, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {io, Socket} from 'socket.io-client';

import './chat.scss';

import {MessageDataTypes} from "./messageData.types";

import useRoomRoute from "../../hooks/useRoomRoute";
import {UserContext} from "../../services/UserProvider";

import MessageBoard from "../../components/messageBoard";
import Input from "../../components/input/Input";
import ChatHeader from "../../components/chatHeader";
import UserList from "../../components/userList";
// import Button from "../../components/button";
// import VideoContainer from "../../components/videoContainer";

import QUERY_PARAMS from '../../constants/QUERY_PARAMS.json';

// const { RTCPeerConnection, RTCSessionDescription } = window;
// let defaultStream = new MediaStream();
const ENDPOINT = 'localhost:5000';
let socket: Socket;

export default function Chat() {
    const navigate = useNavigate();
    const roomRoute = useRoomRoute({extractor: QUERY_PARAMS.room});
    const { user, logout } = useContext(UserContext);
    const [currentUsers, setCurrentUsers] = useState<Array<string>>([]);
    const [messages, setMessages] = useState<Array<{user: string, text: string}>>([]);
    const [messageText, setMessageText] = useState('');
    //TODO figure out better way to set up initial userStream state cuz right now its taking up space or smth idk

    // const [userStream, setUserStream] = useState<MediaStream>(defaultStream);
    // const [userStreams, setUserStreams] = useState<MediaStream>(defaultStream);
    // const peerConnection: MutableRefObject<RTCPeerConnection> = useRef(new RTCPeerConnection());

    const disconnectUser = useCallback(() => {
        if (!user.loggedIn || user.name === '') {
            logout();
            socket.emit('disconnectUser');
            socket.off();
        }
    }, [logout, user]);

    // const callChatroom = useCallback(async (room) => {
    //     const offer = await peerConnection.current.createOffer();
    //     await peerConnection.current.setLocalDescription((new RTCSessionDescription(offer)));
    //     console.log(peerConnection.current);
    //
    //     socket.emit("callRoom", {offer, to: room});
    // }, []);
    //
    // //TODO Can be extracted to custom hook
    // const getUserStream =  useCallback(() => {
    //     const makeCall = (stream: MediaStream) => {
    //         setUserStream(stream);
    //         callChatroom(roomRoute)
    //             .then(() => stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream)))
    //             .then(() => console.log('User successfully made call'))
    //             .catch((error) => console.log('Something went terribly wrong', error));
    //     }
    //     navigator.mediaDevices
    //         .getUserMedia({video: {width: 480}, audio: true})
    //         .then(makeCall)
    // }, [callChatroom, roomRoute]);

    // RETURN to main page if user is not logged in
    useEffect(() => {
        if (!user.loggedIn) {
            navigate('/', {state: roomRoute});
        }
        return () => {
            disconnectUser();
        }
    }, [disconnectUser, navigate, roomRoute, user.loggedIn]);

    //CONNECT
    useEffect(() => {
        socket  = io(ENDPOINT);

        socket.on('roomData', (users: string) => {
            setCurrentUsers([...users]);
        })

        if (!!user.name) {
            socket.emit('join', { username: user.name, roomId: roomRoute }, (error: Error) => {
                if (error) {
                    disconnectUser();
                    logout();
                }
            });
        }
    }, [disconnectUser, logout, roomRoute, user.name]);

    //HANDLE video?
    // useEffect(() => {
    //     socket.on('callMade', async (data) => {
    //         await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
    //         const answer = await peerConnection.current.createAnswer();
    //         await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
    //
    //         socket.emit('makeAnswer', {answer, to: data.room});
    //     })
    //     socket.on('answerMade', async (data) => {
    //         let isCalling: boolean = false;
    //
    //         await peerConnection.current.setRemoteDescription((new RTCSessionDescription(data.answer)));
    //         if (!isCalling) {
    //             await callChatroom(data.room);
    //             isCalling = true;
    //         }
    //     })
    //     peerConnection.current.ontrack = function ({streams: [incomingStream]}) {
    //         setUserStreams(incomingStream);
    //     }
    // }, [callChatroom, userStreams])

    // HANDLE messages and maybe VIDEO??????
    useEffect(() => {
        socket.on('message', (data: MessageDataTypes) => {
            if (data.user !== user.name) {
                setMessages([...messages, {user: data.user, text: data.text}]);
            }
        })
        socket.on('roomData', (users: string) => {
            setCurrentUsers([...users]);
        })

        return () => {
            disconnectUser();
        };
    }, [disconnectUser, messages, user.name]);

    const sendMessage = (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (messageText) {
            socket.emit('sendMessage', messageText, () => setMessageText(''));
            setMessages([...messages, {user: user.name, text: messageText}]);
        }
    }


    return (
        <div className={'chat__wrapper'}>
            <div className={'chat__container'}>
                <ChatHeader room={roomRoute} />
                <MessageBoard messages={messages} username={user.name}/>
                <Input message={messageText} setMessage={setMessageText} sendMessage={sendMessage} />
            </div>
            <UserList users={currentUsers} />
            {/*<div>*/}
            {/*    <Button buttonLabel={'MakeCall'} callback={getUserStream} />*/}
            {/*    <VideoContainer isMuted={true} stream={userStream} className={'own-stream'} />*/}
            {/*    {userStreams ? <div>*/}
            {/*        /!*{*!/*/}
            {/*        /!*    userStreams.map(*!/*/}
            {/*        /!*        (incomingStream) => <VideoContainer isMuted={true} stream={incomingStream}*!/*/}
            {/*        /!*                                            className={'incoming-stream'} key={incomingStream.id}/>*!/*/}
            {/*        /!*    )*!/*/}
            {/*        /!*}*!/*/}
            {/*        <VideoContainer isMuted={true} stream={userStreams}*/}
            {/*                        className={'incoming-stream'} key={userStreams.id}/>*/}
            {/*    </div> : <div />}*/}
            {/*</div>*/}
        </div>
    )
}