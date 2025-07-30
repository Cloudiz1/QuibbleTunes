import { getNewToken } from "@/app/lib/spotify";
import { Track } from "@/app/types";

/** body {
    refreshToken: string,
    playlistId: string,
    offset: number,
    limit: number
}
*/
export async function POST(request: Request) {
    const body = await request.json();
    const accessToken = await getNewToken(body.refreshToken);

    const res = await fetch(`https://api.spotify.com/v1/playlists/${body.playlistID}/tracks?offset=${body.offset}&limit=${body.limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const tracks = await res.json();
    
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

    return new Response(JSON.stringify({index: body.offset, tracks: returnedTracks}));
}