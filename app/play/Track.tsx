import { Track } from "../types"
interface TrackProps {
    track: Track | null
    index: number 
}

export function TrackComponent({ track, index }: TrackProps) {
    function msToTime(ms: number) {
        var minutes = Math.floor(ms / 60000);
        var seconds = parseInt(((ms % 60000) / 1000).toFixed(0));
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    if (track) {
        return <>
            <div className="w-full h-17 flex items-center -mt-1.5 mb-1.5 overflow-hidden">
                <p className="w-11 flex-none text-right mr-2">{index}</p>
                <img className="w-14 h-14 flex-none object-fill rounded-sm" src={track.coverImage} />

                <div className="flex flex-col flex-1 pl-2 pr-8 min-w-0">
                    <p className="truncate text-lg -mb-1">{track.name}</p>
                    <p className="truncate text-sm text-white/90">{track.artists.join(", ")}</p>
                </div>

                <p className="flex-1 truncate text-white">{track.album}</p>
                <p className="w-12 flex-none text-right mr-6">{msToTime(track.duration)}</p>
            </div>
        </>
    } else {
        return <>
            <div className="w-full h-17 flex items-center -mt-1.5 mb-1.5 overflow-hidden">
                <p className="w-11 flex-none text-right mr-2">{index}</p>
                <div className="w-14 h-14 flex-none object-fill rounded-sm bg-purple-500"></div>

                <div className="flex flex-col flex-1 pl-2 pr-8">
                    <p className="mb-1 w-4/5 rounded-sm bg-purple-500">&nbsp;</p>
                    <p className="text-xs w-3/5 rounded-sm bg-purple-500">&nbsp;</p>
                </div>

                <div className="flex-1">
                    <p className="rounded-sm bg-purple-500 w-4/5">&nbsp;</p>
                </div>
                <div className="w-12 flex-none">
                    <p className="rounded-sm w-3/5 bg-purple-500">&nbsp;</p>
                </div>
            </div>
        </>
    }
}
