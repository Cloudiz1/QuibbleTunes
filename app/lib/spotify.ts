import { Playlist } from "../types";

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
    const playlistRes = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const spotifyPlaylists = await playlistRes.json();
    const trackResponses = [];

    for (const spotifyPlaylist of spotifyPlaylists.items) {
        if (!spotifyPlaylist.images) {
            continue;
        }

        let playlist: Playlist = {
            coverImage: spotifyPlaylist.images[0].url, 
            id: spotifyPlaylist.id, 
            name: spotifyPlaylist.name, 
            tracks: []
        }
        playlists.push(playlist);

        trackResponses.push(
            fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => 
                res.json()
                .then((tracks) => {
                    for (const track of tracks.items) {
                        let artists: Array<string> = [];
                        for (const artist of track.track.artists) {
                            artists.push(artist.name);
                        }

                        playlist.tracks.push({
                            name: track.track.name, 
                            artists: artists, 
                            duration: track.track.duration_ms, 
                            id: track.track.id,
                            coverImage: track.track.album.images[0].url,
                            album: track.track.album.name
                        });
                    }
                })
            )
        );
    }

    await Promise.all(trackResponses);

    return playlists;
}