import {DateTime} from "./dateTime";

export interface User {
    id: number,
    name?: string,
    imgSrc?: string,
    totalEntries?: number,
    maxEntriesPerDay?: number,
    joinDate?: DateTime
}