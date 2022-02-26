import {useCallback, VideoHTMLAttributes} from "react";

interface OwnProps extends VideoHTMLAttributes<HTMLVideoElement>{
    isMuted: boolean,
    stream: MediaStream,
}

export default function VideoContainer({isMuted, stream}: OwnProps) {
    const refVideo = useCallback((node: HTMLVideoElement) => {
        if (node) {
            node.srcObject = stream;
        }
    }, [stream]);
    return(
        <video autoPlay muted={isMuted} ref={refVideo}/>
    )
}