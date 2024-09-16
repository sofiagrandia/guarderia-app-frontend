import { Servicio } from './../../../interfaces/servicio';
import { Component } from '@angular/core';
import { ServicioService } from '../../../services/servicio.service';

import { DivisaPipe } from '../../../pipes/divisa.pipe';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [DivisaPipe, ReactiveFormsModule],
  templateUrl: './serviciosAdmin.component.html',
  styleUrl: './serviciosAdmin.component.css'
})
export class ServiciosAdminComponent {
  form!: FormGroup;
  servicios: Servicio[] = [];
  userId: string | string = "";

  constructor(private servicioService: ServicioService, private authService: AuthService,private builder: FormBuilder, private router: Router, private viewportScroller: ViewportScroller) {
  servicioService.getAll().subscribe({
    next: (response) => {
      this.servicios = response as Servicio[];
      
      this.servicios = this.servicios.map((servicio) => {
        return servicio; // return the modified servicio
      });
    },
    error: () => {},
  });

  

  this.form = builder.group({
    servicioName: new FormControl(null), // New control for pet's name
    servicioDesc: new FormControl(null), // New control for pet's type
    servicioPrice: new FormControl(null), // New control for pet's breed
    servicioImg: new FormControl(null), // New control for pet's date of birth
  });
  this.loadUser();
  }
  public onClick(elementId: string): void { this.viewportScroller.scrollToAnchor(elementId); } 

  
  loadUser(){
    this.userId = this.authService.user!.id;
 }

  addServicio() {
    
    console.log("UserId", this.userId)
    console.log("En addServicio()")
    
    console.log(this.form.value.petName);
    this.servicioService
      .saveServicio(
        this.form.value.servicioName,
        this.form.value.servicioDesc,
        this.form.value.servicioPrice,
        this.form.value.servicioImg,
        true
      )
      .subscribe({
        next: (response: any) => {
          const servicioId = response.servicio._id;
          console.log("Response", response)
          Swal.fire({
            title: 'Servicio agregado correctamente',
            text: `Nuevo servicio añadido: ${
              this.form.value.servicioName
            } `,
            icon: 'success',
            timer: 2000,
            didClose: () => {
              this.router.navigateByUrl('/servicios');
            },
            
          });
          
          if (!this.userId) {
            console.error('User is not logged in or user ID is not available');
            return;
          }
      
          
          
         
          


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
          Swal.fire({
            title: 'Oops',
            text: `Ha ocurrido un error añadiedo el servicio ${
              err.error.message || 'Unknown error'
            }`,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
        },
      });
   
  }


  deleteServicio(servicioId: string) {
    console.log(servicioId);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('dentro del then', servicioId);
        this.servicioService.deleteServicio(servicioId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Servicio eliminado!',
              text: 'El servicio ya no está disponible',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });
            //para que visualmente cambie la pantalla aka lo quite del array del front
            this.servicios = this.servicios.filter((x) => x._id !== servicioId);
          },
          error: () => {
            Swal.fire({
              title: 'Oops!',
              text: 'Ha ocurrido un error',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        });
      }
    });
  }
}
