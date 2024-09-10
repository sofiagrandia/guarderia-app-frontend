import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  url: string = 'http://localhost:3002/api/mascotas';
  saveMascota(
    name: string,
    type: string,
    raza: string,
    fechaNacimiento: Date
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });

  

    return this.http.post(this.url, {
      name: name,
    type: type,
    raza: raza,
    fechaNacimiento: fechaNacimiento
    }, {headers});
  }


  getAll(){
    return this.http.get(this.url)
  }

  getById(id: string){
    return this.http.get(`${this.url}/${id}`)
  }

}
