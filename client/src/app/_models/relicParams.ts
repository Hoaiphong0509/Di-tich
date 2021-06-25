import { Relic } from "./relic";

export class RelicParams {
    pageNumber = 1;
    pageSize = 4;
    idRelic: number;

    constructor(relic: Relic){
        this.idRelic = relic.id
    }
}