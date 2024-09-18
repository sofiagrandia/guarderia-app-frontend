import { Servicio } from './../interfaces/servicio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CentroService {
  url: string = 'http://localhost:3002/api/centros';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll() {
    return this.http.get(this.url);
  }

  getById(id: string) {
    return this.http.get(`${this.url}/${id}`);
  }

  saveCentro(
    direccion: string,
    image: string,
    telefono: string,
    plazasDisponibles: number,
    precioBase: number,
    servicios: Servicio[]
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });

    console.log('En save centro');

    return this.http.post(
      this.url,
      {
        direccion: direccion,
        image: image,
        telefono: telefono,
        plazasDisponibles: plazasDisponibles,
        precioBase: precioBase,
        servicios: servicios,
      },
      { headers }
    );
  }

  deleteCentro(centroId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.delete(`${this.url}/${centroId}`,{headers})
  }
}
