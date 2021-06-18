import { Photo } from "./photo";


export interface Relic {
    id: number;
    name: string;
    title: string;
    content: string;
    view: number;
    photoUrl: string;
    created: Date;
    photos: Photo[];
}
