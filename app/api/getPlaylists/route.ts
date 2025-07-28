import { getNewToken } from "@/app/lib/spotify";
import { Playlist } from "@/app/types";

export async function getPlaylists(accessToken: string): Promise<Array<Playlist>> { //TODO: move this to an api call so i can start loading a skeleton 
    let playlists: Array<Playlist> = [];
    let url: string = "https://api.spotify.com/v1/me/playlists";

    let index: number = 0;
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
                tracks: [],
            }
            
            index++;
            playlists.push(playlist);
        }

        url = spotifyPlaylists.next;
    }
    
    return playlists;
}

/*
body {
    refreshToken: string
}
*/
export async function POST(request: Request) {
    const body = await request.json();
    const accessToken = await getNewToken(body.refreshToken);

    const playlists = await getPlaylists(accessToken);
    return new Response(JSON.stringify(playlists));
}

