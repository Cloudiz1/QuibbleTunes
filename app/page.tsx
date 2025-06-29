"use client"

import { redirect } from "next/navigation";
import Cookies from "js-cookie";
// import { cookies } from "next/headers";

export default function Home() {
  async function authRedirect() {
    Cookies.get("refreshToken");

    if (!Cookies.get("refreshToken")) {
      const res = await fetch("/api/requestPerms");
      const body = await res.json();
  
      Cookies.set("spotifyState", body.spotifyState);
      redirect(body.redirectUrl);
    }

    redirect("/play");
  }

  return (
    <button onClick={authRedirect}>Try the app</button>
  )
}