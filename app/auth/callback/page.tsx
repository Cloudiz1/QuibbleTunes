"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react";
import Cookies from "js-cookie"

export default function GetRefreshToken() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const spotifyState = Cookies.get("spotifyState");
    
        if (searchParams.get("Error") != null || !spotifyState) {
            router.push("/"); // TODO: Error page at some point
            throw new Error("Something went wrong, please try again.")
        }
        
        if (spotifyState.toString().trim() !== searchParams.get("state")?.toString().trim()) {
            throw new Error("mismatched state"); 
        }
    
        const code = searchParams.get("code");
        if (!code) {
            throw new Error("could not get code");
        }
    
        fetch("/api/getRefreshToken", {
            method: "POST",
            body: JSON.stringify({"code": code})
        })
        .then((res) => {
            return res.json();
        })
        .then((body) => { // parse spotify token
            Cookies.set("refreshToken", body.refresh_token);

            router.push("/play");
        });
    })
    
    return <p>callback :3</p>

    // if (!spotifyState) router.push("/auth");

    // if (!("code" in searchParams)) {
    //     // TODO: handle this error
    //     throw new Error("could not get code");
    // }
}