export declare interface Track {
    id: string,
    name: string,
    artists: Array<string>,
    coverImage: string,
    duration: number,
    album: string
}

export declare interface Playlist {
    id: string,
    name: string,
    coverImage: string,
    description: string,
    length: number
}