
import { Centro } from "./centro";
import { User } from "./user";
import { Vehicle } from "./vehicle";

export interface Booking {
    _id: string
    user: User
    centro: Centro
    date: string
    price: number
    extras: boolean
    discount: number
}
