import { Playlist, Track } from "../types"
import { PlaylistHeader } from "./PlaylistHeader";
import { TrackComponent } from "./Track";
import { getAccessToken, getTracks } from "../lib/spotify";
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Cookies from "js-cookie";

interface PlaylistViewProps {
    currentPlaylist: Playlist,
    trackHeight: number
}

const refreshToken = Cookies.get("refreshToken");
const buffer = 5;
const numTracks = 10 + buffer * 2;

export function PlaylistView({ currentPlaylist, trackHeight }: PlaylistViewProps) {
    const allTracks = useRef<Array<Track | null>>([]);
    const throttle = useRef<NodeJS.Timeout | null>(null);
    const mainView = useRef<HTMLDivElement | null>(null);
    const [scrollVal, setScrollVal] = useState(0);
    const [displayedTracks, setDisplayedTracks] = useState<Array<Track | null>>([]);
    
    const index = Math.max(0, Math.floor(scrollVal / trackHeight) - buffer);

    function updateDisplayedTracks() {
        setDisplayedTracks(allTracks.current.slice(index, index + numTracks));
    }

    async function updateTracks() {
        let offset: number | null = null;
        for (let i = index; i < Math.min(index + numTracks, currentPlaylist.length); i++) {
            if (!allTracks.current[i]) {
                offset = i;
                break;
            }
        }

        if (offset === null) return;    

        const accessToken = await getAccessToken(refreshToken!);
        const res = await getTracks(accessToken, currentPlaylist.id, offset, numTracks);
        res.tracks.forEach((track: Track, i: number) => {
            allTracks.current[i + res.index] = track;
        });
    }

    useLayoutEffect(() => {
        if (throttle.current) {
            clearTimeout(throttle.current);
            throttle.current = null;
        }

        allTracks.current = (new Array(currentPlaylist.length)).fill(null);
        updateDisplayedTracks()
        updateTracks()

        if (mainView.current) mainView.current.scrollTop = 0;
    }, [currentPlaylist])

    useEffect(() => { // throttle scrolling
        if (throttle.current) return;
        throttle.current = setTimeout(() => {
            updateTracks();
            throttle.current = null;
        }, 100);
    }, [scrollVal]);

    useEffect(() => {
        updateDisplayedTracks();
    }, [index])
        
    const tracks = displayedTracks.map((track: Track | null, i: number) => {
        const top = (i + index) * trackHeight;
        return <div key={i} className="absolute left-0 w-full" style={{ top: `${top}px`, height: `${trackHeight}px` }}>
            <TrackComponent track={track} index={i + index + 1}/>
        </div>
    })

    return (
        // @ts-expect-error
        <div ref={mainView} onScroll={() => setScrollVal(mainView.current.scrollTop)} className="overflow-y-scroll h-full">
            <PlaylistHeader title={currentPlaylist.name} description={currentPlaylist.description} coverImage={currentPlaylist.coverImage}/>
            <div className="relative w-full overflow-y-hidden" style={{ height: `${currentPlaylist.length * trackHeight}px` }}>
                {tracks}
            </div>
        </div>
    )
}