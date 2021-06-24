import { User } from "./user";

export class UserParams {
    pageNumber = 1;
    pageSize = 4;
    currentUsername: string;

    constructor(user: User){
        this.currentUsername = user.username
    }
}