"use client"

import { Playlist } from "../types";
import { Dispatch, SetStateAction } from "react";

interface PlaylistButtonProps {
    title: string,
    href: string,
    playlist: Playlist
    setCurrentPlaylist: Dispatch<SetStateAction<string>>
}

export function PlaylistComponent({title, href, playlist, setCurrentPlaylist}: PlaylistButtonProps) {
    function populateTracks() {
        setCurrentPlaylist(playlist.id);
    }

    return (
        <button onClick={populateTracks}>
            <img className="w-16 h-16 object-cover rounded-sm" src={href} alt="coverImage" />
        </button>
    );
}