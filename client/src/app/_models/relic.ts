import { Photo } from "./photo";


export interface Relic {
    id: number;
    name: string;
    title: string;
    content: string;
    view: number;
    photoUrl: string;
    isApproved: boolean;
    isReject: boolean;
    created: Date;
    author: string;
    photos: Photo[];
}
