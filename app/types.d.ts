export declare interface Track {
    id: string,
    name: string,
    artists: Array<string>,
    duration: number
}

export declare interface Playlist {
    id: string,
    name: string,
    coverImage: string,
    tracks: Array<Track>
}