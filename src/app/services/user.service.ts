import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url : string = "http://localhost:3002/api/users"
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(){
    return this.http.get(this.url)
  }

  getById(id: string){
    console.log(id)
    return this.http.get(`${this.url}/${id}`)
  }

  deleteUser(userId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.delete(`${this.url}/${userId}`,{headers})
  }


  uploadAvatar(formData: FormData) {
    const url = `${this.url}/users/upload-avatar`;  // Backend endpoint for uploading the avatar

    // Headers are not needed for FormData as it sets them automatically
    return this.http.post(url, formData);
  }

}
