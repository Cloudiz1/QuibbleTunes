import { decodeHTML } from "../lib/util"

interface PlaylistHeaderProps {
    title: string,
    coverImage: string,
    description: string,
}

export function PlaylistHeader({ title, coverImage, description }: PlaylistHeaderProps) {
    return (
        <div className="p-2 mb-3 flex">
            <img className="w-55 h-55 object-fill" src={coverImage}/>
            <div className="ml-2 flex flex-col h-55">
                <p className="text-4xl font-bold">{title}</p>
                <p className="">{decodeHTML(description)}</p>
            </div>
        </div>
    );
} 