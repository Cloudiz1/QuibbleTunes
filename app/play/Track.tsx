import { Track } from "../types"

interface TrackProps {
    track: Track
}

export function TrackComponent({ track }: TrackProps) {
    function msToTime(ms: number) {
        var minutes = Math.floor(ms / 60000);
        var seconds = parseInt(((ms % 60000) / 1000).toFixed(0));
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    return <>
        <div className="w-full h-18 flex items-center text-nowrap">
            <img className="w-16 h-16 object-fill flex-none rounded-sm" src={track.coverImage} />
            <p className="w-16 flex-5 pl-2 overflow-hidden text-ellipsis">{track.name}</p>
            <p className="w-16 flex-5 overflow-hidden text-ellipsis">{track.album}</p> 
            <p className="w-16 flex-3 overflow-hidden text-ellipsis">{track.artists.join(", ")}</p>
            <p className="w-12 flex-none overflow-hidden text-right mr-6">{msToTime(track.duration)}</p>
        </div>
    </>
}
