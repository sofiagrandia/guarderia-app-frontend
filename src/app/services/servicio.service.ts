import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  url : string = "http://localhost:3002/api/servicios"
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(){
    return this.http.get(this.url)
  }

  getById(id: string){
    return this.http.get(`${this.url}/${id}`)
  }

  saveServicio(
    titulo: string,
    description: string,
    precio: string,
    image: string,
    available: true
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });

  

    return this.http.post(this.url, {
      titulo: titulo,
      description: description,
      precio: precio,
      image: image,
      available: available
    }, {headers});
  }

  deleteServicio(servicioId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.delete(`${this.url}/${servicioId}`,{headers})
  }
}

