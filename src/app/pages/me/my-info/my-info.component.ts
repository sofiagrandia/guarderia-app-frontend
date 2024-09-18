import { User } from './../../../interfaces/user';
import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
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
import { FormatDatefromDatePipe } from '../../../pipes/format-datefrom-date.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [ReactiveFormsModule, FormatDatefromDatePipe, MatIconModule, CommonModule
  ],
  templateUrl: './my-info.component.html',
  styleUrl: './my-info.component.css',
})
export class MyInfoComponent {

  passwordType: string = 'password';
  form!: FormGroup;
  formPwd!: FormGroup;
  formImage!: FormGroup;
  file: string = '';
  mascotas: Mascota[] = [];
  user: User = {
    name: '',
    email: '',
    token: '',
    _id: '',
    mascotas: [],
    role:''

  };
  userId: string | string = '';
  mascota: Mascota = {
    _id: '',
    name: '',
    type: '',
    raza: '',
    fechaNacimiento: new Date(), // or you could set it to null or some placeholder date if needed
  };
  fechaString: string | string = '';

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.form = builder.group({
      petName: new FormControl(null), // New control for pet's name
      petType: new FormControl(null), // New control for pet's type
      petBreed: new FormControl(null), // New control for pet's breed
      petDob: new FormControl(null), // New control for pet's date of birth
    });
    this.formPwd = builder.group({
      pwd: new FormControl(null), 
    });
    this.formImage = builder.group({
      image: new FormControl(null), 
    });
    
   
    this.loadUser();
    this.loadMascotas();
   
  }
  loadUser() {
    this.userId = this.authService.user!._id;

    this.userService.getById(this.userId).subscribe({
      next: (response: any) => {
        const user = response as User; // Assuming response matches the User interface
        console.log('User Mascotas:', user);
        console.log('mascota id', user.mascotas);
        this.user= user;
        if (user.mascotas && user.mascotas.length > 0) {
          for (const m of user.mascotas) {
            console.log('mascota id', m);
            this.mascotaService.getById(m).subscribe({
              next: (response) => {
                const mascota = response as Mascota;

                this.mascotas.push(mascota); 
                this.user = user;// Add each valid servicio object to the array
              },
              error: (err) =>
                console.error(`Error fetching mascota with ID: ${m}`, err),
            });
          }

          console.log('Mascotas loaded:', this.mascotas);
        } else {
          this.mascotas = [];
          console.log('No mascotas found for the user.');
        }
      },
      error: (err) => {
        console.log('Mascotas:', this.mascotas);
        console.error('Error fetching user mascotas', err);
      },
    });
  }

  loadMascotas() {
    this.loadUser();
    // Assuming `authService.getUser()` returns the logged-in user's ID
    //const userId = this.authService.user!.id;
    console.log('UserId en reserva', this.userId);

    if (!this.userId) {
      this.authService.deleteUser();
      console.error('User is not logged in or user ID is not available');
      return;
    }

    // Fetch the user by ID and get their mascotas
    this.userService.getById(this.userId).subscribe({
      next: (response: any) => {
        const user = response as User; // Assuming response matches the User interface
        console.log('User Mascotas:', user.mascotas);
        console.log('mascota id', user.mascotas);
        if (user.mascotas && user.mascotas.length > 0) {
          for (const m of user.mascotas) {
            console.log('mascota id', m);
            this.mascotaService.getById(m).subscribe({
              next: (response) => {
                const mascota = response as Mascota;
                console.log("Response", response)
                this.mascotas.push(mascota); // Add each valid servicio object to the array
              },
              error: (err) =>
                console.error(`Error fetching mascota with ID: ${m}`, err),
            });
          }

          console.log('Mascotas loaded:', this.mascotas);
        } else {
          this.mascotas = [];
          console.log('No mascotas found for the user.');
        }
      },
      error: (err) => {
        console.log('Mascotas:', this.mascotas);
        console.error('Error fetching user mascotas', err);
      },
    });
  }

  get hasMascotas(): boolean {
    return this.user?.mascotas != null;
  }
  addPet() {
    console.log('UserId', this.userId);
    console.log('En addPet()');
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
          console.log('Response', response);

          if (!this.userId) {
            console.error('User is not logged in or user ID is not available');
            return;
          }

          this.userService.getById(this.userId).subscribe({
            next: (response: any) => {
              console.log('Meto nuevo usuario', response);
              this.user = response as User;
              this.user.mascotas?.push(mascotaId);
              console.log('Metido', this.user);
              console.log('User', this.user);
              if (this.user != null) {
                this.authService.updateUser(this.user, this.userId).subscribe({
                  next: (response: any) => {
                    console.log('respuesta auth', response);
                  },
                });
              }
            },
          });
        },
        error: (err) => {
          console.error('Error during pet insertion:', err);
          // Handle the error (e.g., show an error message to the user)
        },
      });
  }

  updatePwd() {
    console.log('UserId', this.userId);
    console.log('En updatePwd()');
   
    console.log(this.form.value.petName);
   

          if (!this.userId) {
            console.error('User is not logged in or user ID is not available');
            return;
          }

          this.userService.getById(this.userId).subscribe({
            next: (response: any) => {
              console.log('Meto nuevo usuario', response);
              this.user = response as User;
              console.log('Metido', this.user);
              console.log('User', this.user);
              this.user.password = this.formPwd.value.pwd;
              console.log("Nueva pwd",this.user.password)
              if (this.user != null) {
                this.authService.updateUser(this.user, this.userId).subscribe({
                  next: (response: any) => {
                    console.log('respuesta auth', response);
                    this.authService.deleteUser();
                  },
                });
              }
            },
          });

          
       
  }
  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
 }
  onFileChange() {
    
   
    
      
      console.log('User con file', this.user);
      this.userService.getById(this.userId).subscribe({
        next: (response: any) => {
          console.log('Meto nuevo usuario', response);
          this.user = response as User;
          this.user.image = this.formImage.value.image;
          console.log('Metido', this.user);
          console.log('User', this.user);
          console.log("Nueva pwd",this.user.password)
          if (this.user != null) {
            this.authService.updateUser(this.user, this.userId).subscribe({
              next: (response: any) => {
                console.log('respuesta auth', response);
                
              },
            });
          }
        },
      });
      //this.resetInput();   
    
  
 }
}
