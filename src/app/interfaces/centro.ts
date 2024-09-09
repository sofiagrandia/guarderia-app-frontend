import { Servicio } from "./servicio"

export interface Centro {
    _id: string
    name: string
    telefono: string
    direccion: string
    description: string
    image: string
    plazasDisponibles: number
    precioBase: number
    servicios: [Servicio]
}
