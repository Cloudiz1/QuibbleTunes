import { cookies } from "next/headers";
import { Playlist } from "../types";

export async function getPlaylists(): Promise<Array<Playlist>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken) {
        return new Promise((resolve, reject) => {
            reject(new Error("missingAccessToken")); 
        })
    }

    let playlists: Array<Playlist> = [];

    const playlistRes = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken.value}` },
    });

    const spotifyPlaylists = await playlistRes.json();
    const trackResponses = [];

    for (const spotifyPlaylist of spotifyPlaylists.items) {
        let playlist: Playlist = {coverImage: spotifyPlaylist.images[0].url, id: spotifyPlaylist.id, name: spotifyPlaylist.name, tracks: []}
        playlists.push(playlist);

        trackResponses.push(
            fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken.value}` },
            })
            .then((res) => 
                res.json()
                .then((tracks) => {
                    for (const track of tracks.items) {
                        let artists: Array<string> = [];
                        for (const artist of track.track.artists) {
                            artists.push(artist);
                        }

                        playlist.tracks.push({name: track.track.name, artists: artists, duration: track.track.duration_ms, id: track.track.id});
                    }
                })
            )
        );
    }

    await Promise.all(trackResponses);

    return playlists;
}