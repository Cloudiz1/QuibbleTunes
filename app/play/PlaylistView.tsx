"use client"
import { Playlist, Track } from "../types"
import { PlaylistHeader } from "./PlaylistHeader";
import { TrackComponent } from "./Track";
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Cookies from "js-cookie";

interface PlaylistViewProps {
    currentPlaylist: Playlist 
}

let allTracks: Array<Track | null> = [];

const refreshToken = Cookies.get("refreshToken");
const spotifyLimit = 100;

const buffer = 5;
const numVisible = 10;
const numRendered = 2 * buffer + numVisible;

export function PlaylistView({ currentPlaylist }: PlaylistViewProps) {
    const mainView = useRef(null);
    const measureRef = useRef(null);
    const displayedRange = useRef([0, numRendered]);

    const [displayedTracks, setDisplayedTracks] = useState<Array<Track | null>>(allTracks);
    const [trackHeight, setTrackHeight] = useState<number | null>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const startIndex = Math.max(0, Math.floor(scrollTop / trackHeight) - buffer);
    const endIndex = Math.min(currentPlaylist.length, startIndex + numRendered);

    const handleScroll = () => {
        setScrollTop(mainView.current.scrollTop);
    };

    async function updateTracks() {
        let firstEmptyIndex: number | null = null;
        for (let i = startIndex; i < endIndex; i++) {
            if (!allTracks[i]) {
                firstEmptyIndex = i;
                break;
            }
        }

        if (firstEmptyIndex == null) return;
        
        const res = await fetch("/api/getTracks", {
            method: "POST",
            body: JSON.stringify({
                refreshToken: refreshToken,
                playlistID: currentPlaylist.id,
                offset: firstEmptyIndex,
                limit: spotifyLimit
            })
        });

        const body = await res.json();

        body.tracks.forEach((track: Track, i: number) => {
            if (!allTracks[i + body.index]) {
                allTracks[i  + body.index] = track;
            }
        })

        setDisplayedTracks(allTracks.slice(startIndex, startIndex + numRendered));
    }

    // debounce on api calls
    useEffect(() => {
        const id = setTimeout(() => {
            let [lastStartIndex, lastEndIndex] = displayedRange.current;
            if (startIndex < lastStartIndex || endIndex > lastEndIndex) {
                updateTracks();
                displayedRange.current = [startIndex, endIndex];
            }
        }, 50);

        
        return () => clearTimeout(id);
    }, [scrollTop]);
    
    // updates which tracks are displayed
    useEffect(() => {
        setDisplayedTracks(allTracks.slice(startIndex, startIndex + numRendered));
    }, [startIndex])

    // measures the height of a track to do calculations with
    useLayoutEffect(() => {
        if (measureRef.current && trackHeight === null) {
            const height = measureRef.current.offsetHeight;
            if (height && height > 0) {
                setTrackHeight(height);
            }
        }
    }, [trackHeight]);

    // resets scroll to top on playlist change and gets first playlists
    useLayoutEffect(() => {
        allTracks = new Array(currentPlaylist.length);
        allTracks.fill(null)
        setDisplayedTracks(allTracks.slice(0, numRendered));
        updateTracks()
        if (mainView.current) {
            mainView.current.scrollTop = 0;
        }
    }, [currentPlaylist]); 
    
    if (trackHeight === null) { 
        return (
            <div ref={measureRef}>
                <TrackComponent track={null} index={0} />
            </div>
        );
    }

    const tracks = displayedTracks.map((track: Track | null, i: number) => {
        const top = (i + startIndex) * trackHeight;
        return <div key={i} className="absolute left-0 w-full" style={{ top: `${top}px`, height: `${trackHeight}px` }}>
            <TrackComponent track={track} index={i + startIndex + 1}/>
        </div>
    })

    return (
        <div ref={mainView} onScroll={handleScroll} className="overflow-y-scroll h-full">
            <PlaylistHeader
                title={currentPlaylist.name}
                description={currentPlaylist.description}
                coverImage={currentPlaylist.coverImage}
            />
            <div className="relative w-full" style={{ height: `${currentPlaylist.length * trackHeight}px` }}>
                {tracks}
            </div>
        </div>
    );
}
