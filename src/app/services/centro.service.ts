import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CentroService {


  url : string = "http://localhost:3002/api/centros"
  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(this.url)
  }

  getById(id: string){
    return this.http.get(`${this.url}/${id}`)
  }
}
