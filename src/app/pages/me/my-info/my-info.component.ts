import { User } from './../../../interfaces/user';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Mascota } from '../../../interfaces/mascota';
import { AuthService } from '../../../services/auth.service';
import { MascotaService } from '../../../services/mascota.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './my-info.component.html',
  styleUrl: './my-info.component.css',
})
export class MyInfoComponent {
  form!: FormGroup;
  mascotas: Mascota[] = [];
  user: User | null = null;
  userId: string | string = "";
  mascota: Mascota = {
    _id: '',
    name: '',
    type: '',
    raza: '',
    fechaNacimiento: new Date(), // or you could set it to null or some placeholder date if needed
  };

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private mascotaService: MascotaService,
    private router: Router,
  ) {
    this.form = builder.group({
      petName: new FormControl(null), // New control for pet's name
      petType: new FormControl(null), // New control for pet's type
      petBreed: new FormControl(null), // New control for pet's breed
      petDob: new FormControl(null), // New control for pet's date of birth
    });
    this.loadUser();
  }
loadUser(){
   this.userId = this.authService.user!.id;
}
  addPet() {
    console.log("UserId", this.userId)
    console.log("En addPet()")
    const mascotasArray = this.mascotas.map((mascota) => ({
      _id: mascota._id, // ensure these IDs exist and are valid
      name: mascota.name,
      type: mascota.type,
      raza: mascota.raza,
      fechaNacimiento: mascota.fechaNacimiento,
    }));
    console.log(this.form.value.petName);
    this.mascotaService
      .saveMascota(
        this.form.value.petName,
        this.form.value.petType,
        this.form.value.petBreed,
        this.form.value.petDob
      )
      .subscribe({
        next: (response: any) => {
          const mascotaId = response.mascota._id;
          console.log("Response", response)
          
          if (!this.userId) {
            console.error('User is not logged in or user ID is not available');
            return;
          }
      
          
          this.userService.getById(this.userId).subscribe({
            next: (response: any) => {
              console.log("Meto nuevo usuario",response)
              this.user = response as User;
              this.user.mascotas?.push(mascotaId);
              console.log("Metido",this.user)
              console.log("User",this.user);
          if(this.user!=null){
            this.authService.updateUser(this.user,this.userId).subscribe({
              next: (response: any) => {
                console.log("respuesta auth", response)
              }
            })
           
          }
            },
            
          });
         
          


          /*this.authService
            .saveUser(
              
              
            )
            .subscribe({
              next: () => {
                this.router.navigateByUrl('/login');
              },
              error: (err) => {
                console.error('Error during user signup:', err);
                // Handle the error (e.g., show an error message to the user)
              },
            });*/
        },
        error: (err) => {
          console.error('Error during pet insertion:', err);
          // Handle the error (e.g., show an error message to the user)
        },
      });
   
  }
}
