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
  getAll() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.get(this.url, { headers });
  }

  saveReserva(
    centroId: string,
    dateIn: string,
    dateOut: string,
    price: number,
    discount: number,
    services: Servicio[]
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
console.log("centro recibido", centroId);
    return this.http.post(this.url, {
      centro: centroId,
      dateIn: dateIn,
      dateOut: dateOut,
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
