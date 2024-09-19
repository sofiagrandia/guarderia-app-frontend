import { Servicio } from "./servicio"

export interface Centro {
    _id: string
    name: string
    telefono: string
    direccion: string
    description: string
    image: string
    precioBase: number
    plazasDisponibles: number    
    servicios: string[]
}
