export type SalonType = {
    name: string,
    role_id: string,
    type?: number;
    category?: number;
}

export type SalonCategory = {
    id: number
    name: string,
    role_id: string,
}