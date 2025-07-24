import { Playlist } from "../types";
import { Track } from "../types";

export declare interface getTracksResponse {
    tracks: Array<Track>,
    next: string | null
}

export async function getNewToken(refreshToken: string): Promise<string> {
    const url = "https://accounts.spotify.com/api/token";
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) throw new Error("Missing client info.");

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    }

    const body = await fetch(url, payload);
    const res = await body.json();

    return res.access_token;
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
                tracks: []
            }
            
            playlists.push(playlist);
        }

        url = spotifyPlaylists.next;
    }
    
    return playlists;
}

export async function getTracks() {
    
}