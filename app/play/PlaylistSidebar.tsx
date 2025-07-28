"use client"

import { Playlist } from "../types";
import { Dispatch, SetStateAction } from "react";

interface PlaylistButtonProps {
    title: string,
    href: string,
    playlist: Playlist
    setCurrentPlaylist: Dispatch<SetStateAction<Playlist | null>>
}

// TODO: title is for hover effect
export function PlaylistSidebar({title, href, playlist, setCurrentPlaylist}: PlaylistButtonProps) {
    function populateTracks() {
        setCurrentPlaylist(playlist);
    }

    return (
        <button onClick={populateTracks}>
            <img className="w-16 h-16 object-cover rounded-sm" src={href} alt="coverImage" />
        </button>
    );
}