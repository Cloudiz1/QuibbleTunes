"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie"

export default function load() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    
    useEffect(() => {
        const codeVerifier = Cookies.get("codeVerifier");
    
        if (!code) return;
        if (!codeVerifier) return;
    
        if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) throw new Error("Missing client ID.");

        const authUrl = "https://accounts.spotify.com/api/token";
        fetch(authUrl, {
            method: "POST",
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                grant_type: "authorization_code",
                code,
                redirect_uri: "http://127.0.0.1:3000/auth/callback",
                code_verifier: codeVerifier.toString()
            })
        })
        .then((payload) => {
            return payload.json();
        })
        .then((response) => {
            const accessToken = response.access_token;
            const refreshToken = response.refresh_token;
        
            if (!accessToken || !refreshToken) throw new Error("Failed verification");
            Cookies.set("accessToken", accessToken);
            Cookies.set("refreshToken", refreshToken);
            
            router.push("/play");
        });
    })

    return <p>Loading...</p> //TODO: return a spinner or smth later
}