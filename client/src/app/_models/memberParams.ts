import { Member } from "./member";

export class MemberParams {
    pageNumber = 1;
    pageSize = 4;
    currentUsername: string;

    constructor(member: Member){
        this.currentUsername = member.username
    }
}