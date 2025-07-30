"use client"

import { useState, useEffect } from "react";
import { PlaylistSidebar } from "./PlaylistSidebar";
import { PlaylistView } from "./PlaylistView"
import { PlaylistViewPlaceholder } from "./PlaylistViewPlaceholder";
import { Playlist } from "../types";
import Cookies from "js-cookie";

export default function Player() {
    let [playlists, setPlaylists] = useState<Array<Playlist>>([]);
    let [currentPlaylist, setCurrentPlaylist] = useState<Playlist| null>(null);
    
    useEffect(() => {
        const refreshToken = Cookies.get("refreshToken");
        fetch("/api/getPlaylists", {
            method: "POST",
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        })
        .then((res) => { return res.json() })
        .then((playlists) => { setPlaylists(playlists) });
    }, []);

    let mainView: React.JSX.Element = <PlaylistViewPlaceholder />;
    if (currentPlaylist) {
        mainView = <PlaylistView currentPlaylist={currentPlaylist}/>
    }

    return (
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
    );
}