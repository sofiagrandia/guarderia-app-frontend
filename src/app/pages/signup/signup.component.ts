import { Mascota } from './../../interfaces/mascota';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  passwordType: string = 'password';

  form!: FormGroup;
  mascota: Mascota = {
    _id: '',
    name: '',
    type: '',
    raza: '',
    fechaNacimiento: new Date(), // or you could set it to null or some placeholder date if needed
  };
  mascotas: Mascota[] = [];
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.form = builder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      pwd: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      petName: new FormControl(null), // New control for pet's name
      petType: new FormControl(null), // New control for pet's type
      petBreed: new FormControl(null), // New control for pet's breed
      petDob: new FormControl(null), // New control for pet's date of birth
    });
  }

  signup() {
    //subscribe porque es asíncrono

    const mascotasArray = this.mascotas.map(mascota => ({
      _id: mascota._id, // ensure these IDs exist and are valid
      name: mascota.name,
      type: mascota.type,
      raza: mascota.raza,
      fechaNacimiento: mascota.fechaNacimiento
    }));
    console.log(mascotasArray);
    /*this.mascota.name = this.form.value.petName;
    this.mascota.type = this.form.value.petType;
    this.mascota.raza = this.form.value.petBreed;
    this.mascota.fechaNacimiento = this.form.value.petDob;*/

    this.mascotas.push(this.mascota);
    console.log(this.mascotas);
    /*this.mascotaService.saveMascota(
      this.form.value.petName,
      this.form.value.petType,
      this.form.value.petBreed,
      this.form.value.petDob
    ).subscribe({
      next: () => {*/
        this.authService
      .signup(
        this.form.value.name,
        this.form.value.email,
        this.form.value.pwd,
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Error during user signup:', err);
          // Handle the error (e.g., show an error message to the user)
        }
      });
     /* },
      error: (err) => {
        console.error('Error saving mascota:', err);
        // Handle the error (e.g., show an error message to the user)
      }
    });*/
    
  }
}
