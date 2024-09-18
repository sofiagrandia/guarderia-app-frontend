import { Mascota } from "./mascota"

export interface User {
    name?: string
    email?: string
    token: string
    _id: string
    mascotas?: string[]
    role?:string
}
