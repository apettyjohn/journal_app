export interface User {
    id: number,
    name?: string,
    imgSrc?: string,
    totalEntries: number,
    maxEntriesPerDay: number,
    theme: string,
    accentColor: string
}