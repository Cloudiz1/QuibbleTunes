import { getPlaylists, getNewToken } from "../lib/spotify";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Player from "./Player";

export default async function Play() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");
    if (!refreshToken) {
        redirect("/");
    }

    // const response = fetch("/api/getPlaylists", {
    //     method: "POST",
    //     body: JSON.stringify({
    //         accessToken: accessToken
    //     })
    // });

    // console.log(response);

    return (
        <Player />
    );
}
