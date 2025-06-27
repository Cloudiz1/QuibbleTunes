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
            <img className="w-14 h-14 object-fill" src={href} alt="coverImage" />
        </button>
    );
}