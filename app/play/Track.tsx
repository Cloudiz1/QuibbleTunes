import { Track } from "../types"

interface TrackProps {
    track: Track
}

export function TrackComponent({ track }: TrackProps) {
    return <>
        <p>{track.name}</p>
    </>
}
