import { Playlist } from "@/app/types";
import { getNewToken } from "@/app/lib/spotify";

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
            tracks: returnedTracks,
            index: index
        })))
        url = tracks.next;
     }

     return 200; // i hope youre happy evan
}

/*
body {
    refreshToken: string,
    playlists: Array<Playlist>
}
*/
export async function POST(request: Request) {
    const body = await request.json();
    const accessToken = await getNewToken(body.refreshToken);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            await Promise.all(
                body.playlists.map((playlist: Playlist, i: number) => {
                    return sendTracks(accessToken, controller, encoder, playlist.id, i);
                })
            )

            controller.close();
        }
    })
    
    return new Response(stream);
}