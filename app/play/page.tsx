import { getPlaylists, getNewToken } from "../lib/spotify";
// import { useRouter } from "next/router";
// import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Player from "./Player";

export default async function Play() {
    // const router = useRouter();
    // const refreshToken = Cookies.get("refreshToken");
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");
    if (!refreshToken) {
        redirect("/");
    }

    const accessToken = await getNewToken(refreshToken.value);
    const playlists = await getPlaylists(accessToken);
    return (
            <Player playlists={playlists} />
    );
}