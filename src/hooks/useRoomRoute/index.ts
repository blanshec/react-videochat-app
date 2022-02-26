import {useSearchParams} from "react-router-dom";

import {OwnProps} from "./types";

export default function useRoomRoute({extractor}: OwnProps) {
    const [searchParams] = useSearchParams();

    return searchParams.get(extractor);
}