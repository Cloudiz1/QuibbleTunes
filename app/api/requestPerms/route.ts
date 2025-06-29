interface Response {
    redirectUrl: string,
    spotifyState: string
}

function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

export async function GET() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    if (!client_id) throw new Error("Missing client ID");

    const redirect_uri = "http://127.0.0.1:3000/auth/callback";
    const scope = "playlist-read-private playlist-read-collaborative"
    const state = generateRandomString(64);

    const authUrl = new URL("https://accounts.spotify.com/authorize");

    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", client_id);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("redirect_uri", redirect_uri);
    authUrl.searchParams.set("state", state);

    const res: Response = {
        redirectUrl: authUrl.toString(),
        spotifyState: state
    };

    return new Response(JSON.stringify(res), {
        headers: { "Content-Type": "application/json" }
    });
}