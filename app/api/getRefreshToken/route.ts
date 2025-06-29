export async function POST(request: Request) {
    const body = await request.json();
    const redirectUri: string = "http://127.0.0.1:3000/auth/callback";

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("missing spotify client info");
    }

    const authOptions = {
        method: "POST",
        url: 'https://accounts.spotify.com/api/token',
        body: new URLSearchParams({
            code: body.code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
        },
    };

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const token = await tokenRes.json();

    return new Response(JSON.stringify(token), {
        headers: { "Content-Type": "application/json" }
    });
}