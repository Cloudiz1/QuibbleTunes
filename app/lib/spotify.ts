"use client"

import { redirect } from "next/navigation";
import { Playlist, Track } from "../types";
import Cookies from "js-cookie";

export async function getAccessToken(refreshToken: string) {
    const expires = Cookies.get("accessTokenExpiry");

    if (!expires) redirect("/");
    if (Date.now() < parseInt(expires)) {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) redirect("/");

        return accessToken;
    }

    const res = await fetch("/api/getAccessToken", {
        method: "POST",
        body: JSON.stringify({
            refreshToken: refreshToken
        })
    })

    const body = await res.json();
    Cookies.set("accessToken", body.accessToken);
    Cookies.set("accessTokenExpiry", (Date.now() + body.expiresIn * 1000).toString());
    return body.accessToken;
}

export async function getPlaylists(accessToken: string): Promise<Array<Playlist>> { //TODO: move this to an api call so i can start loading a skeleton 
    let playlists: Array<Playlist> = [];
    let url: string = "https://api.spotify.com/v1/me/playlists";

    while (url) {
        const playlistRes = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    
        const spotifyPlaylists = await playlistRes.json();
        for (const spotifyPlaylist of spotifyPlaylists.items) {
            if (!spotifyPlaylist.images) continue;
    
            let playlist: Playlist = {
                coverImage: spotifyPlaylist.images[0].url, 
                id: spotifyPlaylist.id, 
                name: spotifyPlaylist.name, 
                description: spotifyPlaylist.description,
                length: spotifyPlaylist.tracks.total
            }

            playlists.push(playlist);
        }

        url = spotifyPlaylists.next;
    }
    
    return playlists;
}

export async function getTracks(accessToken: string, playlistID: string, offset: number, limit: number) {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=${offset}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const tracks = await res.json();
    // console.log(tracks)

    let returnedTracks: Array<Track> = [];
    for (const track of tracks.items) {
        let artists: Array<string> = [];
        for (const artist of track.track.artists) {
            artists.push(artist.name);
        }

        returnedTracks.push({
            name: track.track.name, 
            artists: artists, 
            duration: track.track.duration_ms, 
            id: track.track.id,
            coverImage: track.track.album.images[0].url,
            album: track.track.album.name
        });
    }

    const returnedObj = { tracks: returnedTracks, index: offset }
    return returnedObj;
}