
import { Centro } from "./centro";
import { Servicio } from "./servicio";
import { User } from "./user";
import { Vehicle } from "./vehicle";

export interface Booking {
    _id: string
    user: string
    centro: Centro
    services: Servicio[]
    dateIn: string
    dateOut: string
    price: number
    discount: number
}
