"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react";
import Cookies from "js-cookie"

function FetchToken() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const spotifyState = Cookies.get("spotifyState");
    
        if (searchParams.get("Error") != null || !spotifyState) {
            router.push("/"); // TODO: Error page at some point
            throw new Error("Something went wrong, please try again.")
        }
        
        if (spotifyState.toString().trim() !== searchParams.get("state")?.toString().trim()) { //TODO: i think theres lowkey another race condition here somehow?
            throw new Error("mismatched state"); 
        }
    
        const code = searchParams.get("code");
        if (!code) {
            throw new Error("could not get code");
        }

        async function setTokens(spotifyCode: string) {
            const res = await fetch("/api/getRefreshToken", {
                method: "POST",
                body: JSON.stringify({"code": code})
            });

            const body = await res.json();
            Cookies.set("accessTokenExpiry", (Date.now() + body.expires_in * 1000).toString());
            Cookies.set("accessToken", body.access_token);
            Cookies.set("refreshToken", body.refresh_token);
            router.push("/play");
        }
        
        setTokens(code);
    }, [])

    return <p>callback :3</p>
}

export default function getRefreshToken() {
    return (
        <Suspense>
            <FetchToken />
        </Suspense>
    );
}

