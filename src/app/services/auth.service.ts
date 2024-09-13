import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../interfaces/user';
import { Mascota } from '../interfaces/mascota';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //para los cookies
  user: User|null = null
  id: string|string=''
  token: string | null = null;

  //es hasta users porque es la parte común para login y sign up
  url: string = "http://localhost:3002/api/users"


  constructor(private http : HttpClient, private cookieService: CookieService) {
    // rescatar usuario de las cookies, porque user es volátil y las cookies persistentes
    if(cookieService.check('user')){
      this.user = JSON.parse(cookieService.get('user')) 
    }
    if (this.cookieService.check('token')) {
      this.token = this.cookieService.get('token');
    }
  }

  signup(name: string, email: string, pwd: string, pets?: Mascota[]){
    return this.http.post(
      //Estas URIs y atributos están que en el backend
      `${this.url}/register`,
      {
        name: name,
        email: email,
        password: pwd,
        mascotas: pets
      }
    )
  }

  login(email: string, pass: string){
    return this.http.post(`${this.url}/login`,
    {
      //esto se tiene que llamar igual que en backend
      email: email,
      password: pass,
    })
  }

  saveUser(user: User){
    this.user = user
    this.id = user.id
  console.log("Save user", user.id)
    //nombre de la cookie, el json de la interfaz
    this.cookieService.set("user", JSON.stringify(user))

  }

  updateUser(updatedUser: User, id: string) {
    // Update user locally
    this.user = updatedUser;
    this.cookieService.set('user', JSON.stringify(updatedUser));
    this.id=id;
    // Update user on server
    // Replace with your API endpoint
    console.log("UpdatedUser", updatedUser);
    return this.http.patch<User>(`${this.url}/${this.id}`, updatedUser);
  }

  deleteUser(){
    this.user = null
    this.cookieService.delete("user")
  }
}
