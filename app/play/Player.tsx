"use client"

import { useState, useEffect } from "react";
import { PlaylistSidebar } from "./PlaylistSidebar";
import { PlaylistHeader } from "./PlaylistHeader";
import { TrackComponent } from "./Track";
import { Playlist } from "../types";
import Cookies from "js-cookie";

let hasRun = false;

export default function Player() {
    let [playlists, setPlaylists] = useState<Array<Playlist>>([]);
    let [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    if (!hasRun) {
        const getData = async () => {
            const refreshToken = Cookies.get("refreshToken");
            const stream = await fetch("/api/getPlaylists", {
                method: "POST",
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            })

            const reader = stream.body!.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader?.read()!;
                if (done) break; 
                const data = JSON.parse(decoder.decode(value, { stream: true }));

                if (data.type == "playlists") {
                    setPlaylists(data.playlists);
                } else {
                    let newPlaylists = playlists;
                    newPlaylists[data.index].tracks = playlists[data.index].tracks.concat(data.tracks);
                    setPlaylists(newPlaylists); 
                }
            }
        }

        getData();
        hasRun = true;
    }

    let tracks: React.JSX.Element[] = []; 
    let PlaylistHeaderDisplay: React.JSX.Element = <></>;
    if (currentPlaylist) {
        tracks = currentPlaylist.tracks.map((track, i) => <TrackComponent key={i} index={i + 1} track={track}/>)
        PlaylistHeaderDisplay = <PlaylistHeader title={currentPlaylist.name} coverImage={currentPlaylist.coverImage} description={currentPlaylist.description}/>
    }

    // if (playlists && currentPlaylist) {
    //     playlists.map((playlist) => {
    //         if (playlist.id == currentPlaylist.id) {
    //             setCurrentPlaylist(playlist);
    //         }
    //     })
    // }

    return (
        <div className="flex h-dvh overflow-hidden">
            <div className="top-0 left-0 w-20 h-auto p-2 m-2 flex-none overflow-y-scroll bg-blue-500 rounded-sm no-scrollbar"> {/* sidebar */}
                {playlists.map((playlist, i) => (
                    <PlaylistSidebar key={i} title={playlist.name} href={playlist.coverImage} playlist={playlist} setCurrentPlaylist={setCurrentPlaylist}/>
                ))}
            </div>
            <div className="flex-7 h-auto m-2 ml-0 bg-blue-500 overflow-y-scroll rounded-sm no-scrollbar"> {/* playlist */}
                {PlaylistHeaderDisplay}
                {tracks}
            </div>
            <div className="flex-3 h-auto m-2 ml-0 bg-blue-500 rounded-sm"> {/* right side player */}

            </div>
        </div>
    );
}