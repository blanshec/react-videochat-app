import React, {useContext, useEffect, useState, useCallback, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {io, Socket} from 'socket.io-client';
import SimplePeer from 'simple-peer';

import './chat.scss';

import {MessageDataTypes} from "./messageData.types";

import useRoomRoute from "../../hooks/useRoomRoute";
import {UserContext} from "../../services/UserProvider";

import MessageBoard from "../../components/messageBoard";
import Input from "../../components/input/Input";
import ChatHeader from "../../components/chatHeader";
import UserList from "../../components/userList";
import Button from "../../components/button";

import QUERY_PARAMS from '../../constants/QUERY_PARAMS.json';
import {CallStateTypes} from "./callState.types";

const ENDPOINT = 'localhost:5000';
let socket: Socket;

let defaultStream = new MediaStream();
const defaultCall = () => {
    return ({
        from: '',
        signal: null
    })
}

export default function Chat() {
    const navigate = useNavigate();
    const roomRoute = useRoomRoute({extractor: QUERY_PARAMS.room});
    const { user, logout } = useContext(UserContext);
    const [currentUsers, setCurrentUsers] = useState<Array<string>>([]);
    const [messages, setMessages] = useState<Array<{user: string, text: string}>>([]);
    const [messageText, setMessageText] = useState('');
    //TODO figure out better way to set up initial userStream state cuz right now its taking up space or smth idk
    const [call, setCall] = useState<CallStateTypes>(defaultCall);
    const [stream, setStream] = useState<MediaStream>(defaultStream);
    //@ts-ignore
    const peerConnection: React.MutableRefObject<SimplePeer> = useRef();
    const userVideo =  useRef<MediaStream>();
    const incomingVideo = useRef<MediaStream>();

    const disconnectUser = useCallback(() => {
        if (!user.loggedIn || user.name === '') {
            logout();
            socket.emit('disconnectUser');
            peerConnection?.current?.destroy();
            socket.off();
        }
    }, [logout, user]);

    const callRoom =  () => {
        navigator.mediaDevices
            .getUserMedia({video: {width: 480}, audio: true})
            .then((currentStream) => {
                setStream(currentStream);
                // @ts-ignore
                userVideo.current.srcObject = currentStream;
                return currentStream;
            })
            .then((outgoingStream) => {
                const peer = new SimplePeer({ initiator: true, trickle: false, stream: outgoingStream  });

                peer.on('signal', (data) => {
                    socket.emit('callRoom', { room: roomRoute, signalData: data, from: user });
                });

                peer.on('stream', (currentStream) => {
                    // @ts-ignore
                    incomingVideo.current.srcObject = currentStream;
                });
                socket.on('callAccepted', ({signal}) => {
                    peer.signal(signal);
                });
                peerConnection.current = peer;
            })
    };

    const answerCall = () => {
        const peer = new SimplePeer({ initiator: false, trickle: false, stream: stream });


        peer.on('signal', (data) => {
            socket.emit('answerCall', {signal: data, to: call!.from});
        })
        peer.on('stream', (currentStream) => {
            // @ts-ignore
            incomingVideo.current.srcObject = currentStream;
        });
        peer.signal(call.signal);
        peerConnection.current = peer;
    }

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

    // HANDLE messages and incoming calls
    useEffect(() => {
        socket.on('message', (data: MessageDataTypes) => {
            if (data.user !== user.name) {
                setMessages([...messages, {user: data.user, text: data.text}]);
            }
        })
        socket.on('callMade', ({from, signal}) => {
            setCall({ from, signal });
        });
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
            <div className={'video__section'}>
                <div className={'video__container'}>
                    {/*@ts-ignore*/}
                    <video playsInline autoPlay muted ref={userVideo} className={'own-stream'} />
                    {/*@ts-ignore*/}
                    <video playsInline autoPlay muted ref={incomingVideo} className={'incoming-stream'} />
                </div>
                <div className={'video__buttons'}>
                    <Button buttonLabel={'Make Call'} callback={callRoom} />
                    <Button buttonLabel={'Answer Call'} callback={answerCall} />
                </div>
            </div>
        </div>
    )
}