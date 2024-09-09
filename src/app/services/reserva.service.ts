import { Servicio } from './../interfaces/servicio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  url: string = 'http://localhost:3002/api/bookings';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getReservaByUserId(userId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.get(`${this.url}/user/${userId}`, { headers });
  }

  saveReserva(
    vehicleId: string,
    sDate: string,
    eDate: string,
    price: number,
    discount: number,
    services: Servicio[]
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });

    return this.http.post(this.url, {
      vehicle: vehicleId,
      startDate: sDate,
      endDate: eDate,
      price: price,
      discount: discount,
      services: services
    }, {headers});
  }

  deleteReserva(bookingId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.delete(`${this.url}/${this.authService.user?.id}/${bookingId}`,{headers})
  }
}
