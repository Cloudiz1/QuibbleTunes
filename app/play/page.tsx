"use client"

import { Playlist } from "../types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import { getPlaylists, getAccessToken } from "../lib/spotify";

import { TrackComponent } from "./Track"
import { PlaylistSidebar } from "./PlaylistSidebar";
import { PlaylistView } from "./PlaylistView"
import { PlaylistViewPlaceholder } from "./PlaylistViewPlaceholder";
import { redirect } from "next/navigation";

export default function Player() {
    let [playlists, setPlaylists] = useState<Array<Playlist>>([]);
    let [currentPlaylist, setCurrentPlaylist] = useState<Playlist| null>(null);
    let measuredTrack = useRef(null);
    
    useEffect(() => {
        async function updatePlaylists(token: string) {
            const accessToken = await getAccessToken(token);
            const playlists = await getPlaylists(accessToken);
            setPlaylists(playlists);
        } 

        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) redirect("/");

        updatePlaylists(refreshToken!);
    }, []);

    let mainView: React.JSX.Element = <PlaylistViewPlaceholder />;
    if (currentPlaylist) {
        // @ts-expect-error
        mainView = <PlaylistView currentPlaylist={currentPlaylist} trackHeight={measuredTrack.current.offsetHeight} />
    }

    return (
        <>
            <div ref={measuredTrack} className="absolute -top-100">
                <TrackComponent index={0} track={null}/>
            </div>
            <div className="flex h-dvh overflow-hidden">
                <div className="top-0 left-0 w-20 h-auto p-2 m-2 flex-none overflow-y-scroll bg-blue-500 rounded-sm no-scrollbar"> {/* sidebar */}
                    {playlists.map((playlist, i) => (
                        <PlaylistSidebar key={i} title={playlist.name} href={playlist.coverImage} playlist={playlist} setCurrentPlaylist={setCurrentPlaylist}/>
                    ))}
                </div>
                <div className="flex-7 h-auto m-2 ml-0 bg-blue-500 rounded-sm"> {/* playlist */}
                    {mainView}
                </div>
                <div className="flex-3 h-auto m-2 ml-0 bg-blue-500 rounded-sm"> {/* right side player */}
                    
                </div>
            </div>
        </>
    );
}