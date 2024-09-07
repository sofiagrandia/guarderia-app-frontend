import { Class } from "./class";
import { User } from "./user";
import { Vehicle } from "./vehicle";

export interface Booking {
    _id: string
    user: User
    class: Class
    date: string
    price: number
    extras: boolean
    discount: number
}
