"use client"

import { useState } from "react";
import { PlaylistComponent } from "./Playlist";
import { TrackComponent } from "./Track";
import { Playlist } from "../types";

interface HomeProps {
    playlists: Array<Playlist>
}

export default function Home({playlists}: HomeProps) {
    const [currentPlaylist, setCurrentPlaylist] = useState("");

    let tracks: React.JSX.Element[] | null = null; 

    for (const playlist of playlists) {
        if (playlist.id == currentPlaylist) {
            tracks = playlist.tracks.map((track, i) => <TrackComponent key={i} track={track}/>)
        }
    }

    return (
        <div className="flex">
            <div className="top-0 left-0 w-16 h-full m-3">
                {playlists.map((playlist, i) => (
                    <PlaylistComponent key={i} title={playlist.name} href={playlist.coverImage} playlist={playlist} setCurrentPlaylist={setCurrentPlaylist}/>
                ))}
            </div>
            <div className="flex-1">
                {tracks}
            </div>
        </div>
    );
}