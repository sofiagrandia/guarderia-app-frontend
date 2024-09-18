import { CentroService } from './../../../services/centro.service';
import { Component } from '@angular/core';
import { Centro } from '../../../interfaces/centro';
import { AuthService } from '../../../services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Servicio } from '../../../interfaces/servicio';
import { ServicioService } from '../../../services/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-centros',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './centrosAdmin.component.html',
  styleUrl: './centrosAdmin.component.css',
})
export class CentrosAdminComponent {
  centros: Centro[] = [];
  servicios: Servicio[] = [];
  servicioIDArray: string[] = [];
  form!: FormGroup;

  constructor(
    private centroService: CentroService,
    private authService: AuthService,
    private servicioService: ServicioService,
    private builder: FormBuilder,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    centroService.getAll().subscribe({
      next: (response) => {
        this.centros = response as Centro[];
        console.log('Centros:', this.centros);
      },
      error: () => {},
    });

    this.form = builder.group({
      centroDir: new FormControl(null),
      centroImg: new FormControl(null),  // New control for pet's name
      centroTelf: new FormControl(null), // New control for pet's type
      centroPrecio: new FormControl(null), // New control for pet's breed
      centroPlazas: new FormControl(null),
      centroServicios: new FormControl(null), // New control for pet's date of birth
    });
  }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  addCentro() {
    
    console.log("En addCentro()")
    
    const servicioString = this.form.value.centroServicios;
    let serviciosAsArray = servicioString.split(';');
    console.log("Servicios as array", serviciosAsArray)
    this.centroService
      .saveCentro(
        this.form.value.centroDir,
        this.form.value.centroImg,
        this.form.value.centroTelf,
        this.form.value.centroPrecio,
        this.form.value.centroPlazas,
        serviciosAsArray
      )
      .subscribe({
        next: (response: any) => {
          const centroId = response.centro._id;
          console.log("Response", response)
          Swal.fire({
            title: 'Centro agregado correctamente',
            text: `Nuevo centro añadido: ${
              this.form.value.centroDir
            } `,
            icon: 'success',
            timer: 2000,
            didClose: () => {
              this.router.navigateByUrl('/centros');
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

  deleteCentro(centroId: string) {
    console.log(centroId);
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
        console.log('dentro del then', centroId);
        this.centroService.deleteCentro(centroId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Centro eliminado!',
              text: 'El centro ya no está disponible',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              didClose: () => {
                this.router.navigateByUrl('/centros');
              },
            });
            //para que visualmente cambie la pantalla aka lo quite del array del front
            this.centros = this.centros.filter((x) => x._id !== centroId);
            
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
