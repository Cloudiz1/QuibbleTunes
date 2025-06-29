"use client"

import { useState } from "react";
import { PlaylistComponent } from "./Playlist";
import { TrackComponent } from "./Track";
import { Playlist } from "../types";

interface PlayerProps {
    playlists: Array<Playlist>
}

export default function Player({playlists}: PlayerProps) {
    const [currentPlaylist, setCurrentPlaylist] = useState("");

    let tracks: React.JSX.Element[] = []; 

    for (const playlist of playlists) {
        if (playlist.id == currentPlaylist) {
            tracks = playlist.tracks.map((track, i) => <TrackComponent key={i} track={track}/>)
        }
    }

    return (
        <div className="flex h-dvh overflow-hidden">
            <div className="top-0 left-0 w-20 h-auto p-2 m-2 flex-none overflow-y-scroll bg-blue-500 rounded-sm">
                {playlists.map((playlist, i) => (
                    <PlaylistComponent key={i} title={playlist.name} href={playlist.coverImage} playlist={playlist} setCurrentPlaylist={setCurrentPlaylist}/>
                ))}
            </div>
            <div className="flex-1 h-auto p-2 m-2 ml-0 bg-blue-500 overflow-y-scroll rounded-sm">
                {tracks}
            </div>
        </div>
    );
}