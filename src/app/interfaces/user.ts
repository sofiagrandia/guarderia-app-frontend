import { Mascota } from "./mascota"

export interface User {
    name?: string
    email?: string
    password?: string
    token: string
    _id: string
    mascotas?: string[]
    image?: string
    role?:string
    
}
