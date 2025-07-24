// {accessToken: string}
import { Playlist } from "@/app/types";

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

export async function getPlaylists(accessToken: string): Promise<Array<Playlist>> { 
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

export async function sendTracks(accessToken: string, controller: ReadableStreamDefaultController, encoder: TextEncoder, playlistID: string, index: number) {
    let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`
    while (url) {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })

        let returnedTracks = [];
        const tracks = await res.json();
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

        controller.enqueue(encoder.encode(JSON.stringify({
            type: "tracks",
            tracks: returnedTracks,
            index: index
        })))
        url = tracks.next;
     }

     return 200;
}

export async function POST(request: Request) {
    const body = await request.json();
    const accessToken = await getNewToken(body.refreshToken);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const playlists = await getPlaylists(accessToken);
            
            controller.enqueue(encoder.encode(JSON.stringify({
                type: "playlists",
                playlists: playlists
            })));

            await Promise.all(
                playlists.map((playlist, i) => {
                    return sendTracks(accessToken, controller, encoder, playlist.id, i);
                })
            )

            controller.close();
        }
    })
    
    return new Response(stream);
}