"use client"

// import { spotifyAuth } from "../lib/spotify"
import { redirect } from "next/navigation"
import Cookies from "js-cookie"

export default function Login() {
    function generateRandomString(length: number): string {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    async function hash(codeVerifier: string): Promise<ArrayBuffer> {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        return crypto.subtle.digest('SHA-256', data);
    }

    function base64encode(input: ArrayBuffer): string {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    async function spotifyAuth() {
        const codeVerifier = generateRandomString(128);
        const hashed = await hash(codeVerifier);
        const codeChallenge = base64encode(hashed);

        const redirect_uri = "http://127.0.0.1:3000/auth/callback";
        const scope = "playlist-read-private playlist-read-collaborative";
        const authUrl = new URL("https://accounts.spotify.com/authorize");

        if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) throw new Error("Missing client ID.");

        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
        authUrl.searchParams.set("scope", scope);
        authUrl.searchParams.set("code_challenge_method", "S256");
        authUrl.searchParams.set("code_challenge", codeChallenge);
        authUrl.searchParams.set("redirect_uri", redirect_uri);

        Cookies.set("codeVerifier", codeVerifier);

        redirect(authUrl.toString());
    }

    return <button onClick={spotifyAuth}>Sync with spotify</button>
}