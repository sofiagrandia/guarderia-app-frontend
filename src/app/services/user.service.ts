import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url : string = "http://localhost:3002/api/users"
  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(this.url)
  }

  getById(id: string){
    console.log(id)
    return this.http.get(`${this.url}/${id}`)
  }
}
