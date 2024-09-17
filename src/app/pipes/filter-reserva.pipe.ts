import { Pipe, PipeTransform } from '@angular/core';
import { Booking } from '../interfaces/booking';

@Pipe({
  name: 'filterReserva',
  standalone: true
})
export class FilterReservaPipe implements PipeTransform {

  transform(value: Booking[], filtro: string): Booking[] {
    console.log("UserID:",value);
    console.log(value[0].user)
    return value.filter(x=> x._id.toLowerCase().includes(filtro.toLowerCase()) || (x.user.toLowerCase().includes(filtro)))
  }

}
