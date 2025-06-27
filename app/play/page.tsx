import { getPlaylists } from "../lib/spotify";
import Home from "./Home"

export default async function Play() {
    const playlists = await getPlaylists();

    return <Home playlists={playlists} />
}