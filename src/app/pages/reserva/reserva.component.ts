import { CentroService } from './../../services/centro.service';
import { ReservaService } from './../../services/reserva.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Centro } from '../../interfaces/centro';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DivisaPipe } from '../../pipes/divisa.pipe';
import { AuthService } from '../../services/auth.service';
import { Servicio } from '../../interfaces/servicio';
import { ServicioService } from '../../services/servicio.service';
import { BookingFormData } from '../../interfaces/booking-form-data';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, DivisaPipe],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent {
  centro: Centro | null = null;
  servicio: Servicio | null = null;
  form!: FormGroup;
  mostrarCodigoPromocional: boolean = false;
  selectedServices: Servicio[] = [];
  parametro: string | null = null;
  servicios: Servicio[] = [];
  sumaServicios: number = 0;

  constructor(
    private reservaService: ReservaService,
    private router: Router,
    private builder: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private centroService: CentroService,
    private servicioService: ServicioService
  ) {
    let data: BookingFormData = {
      startDate: null,
      endDate: null,
      promoCode: null,
    };
    if (cookieService.check('booking-form-data')) {
      data = JSON.parse(cookieService.get('booking-form-data'));
    }

    this.form = builder.group({
      fechaIn: new FormControl(data.startDate, [Validators.required]),
      fechaOut: new FormControl(data.endDate, [Validators.required]),
      codigoPromocional: new FormControl([]),
    });

    route.paramMap.subscribe((params) => {
      this.parametro = params.get('id');
    });

    if (this.parametro !== null) {
      centroService.getById(this.parametro).subscribe({
        next: (response) => {
          console.log(response);
          this.centro = response as Centro;
          console.log(this.centro.servicios);
          if (this.centro.servicios && this.centro.servicios.length > 0) {
            const servicioIds = this.centro.servicios; // Ensure _id exists
            console.log('Service IDs:', servicioIds); // Log the IDs to ensure they're valid
            this.loadServicios(servicioIds);
          } else {
            console.error('No valid servicios found in the centro object.');
          }
        },
        error: () => {},
      });
    }
  }

  public get numDias(): number {
    const fechaInStr = this.form.value.fechaIn;
    const fechaOutStr = this.form.value.fechaOut;

    if (!fechaInStr || !fechaOutStr) {
      console.error('Fecha Entrada or Fecha Salida is empty');
      return 0;
    }

    const fechaini = new Date(fechaInStr);
    const fechafin = new Date(fechaOutStr);

    if (isNaN(fechaini.getTime()) || isNaN(fechafin.getTime())) {
      console.error('Invalid date(s) provided');
      return 0;
    }

    const millisDif = fechafin.getTime() - fechaini.getTime();
    const dias = millisDif / 1000 / 60 / 60 / 24;
    return dias < 0 ? 0 : dias;
  }

  onServiceToggle(servicio: Servicio, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Add the service to the list if it is checked
      this.selectedServices.push(servicio);
      console.log(this.selectedServices);
      this.sumaServicios += servicio.precio;  
    } else {
      // Remove the service from the list if it is unchecked
      this.selectedServices = this.selectedServices.filter(
        (s) => s._id !== servicio._id
        
      );
      this.sumaServicios -= servicio.precio; 
    }
  }

  loadServicios(servicioIds: string[]) {
    servicioIds.forEach((id) => {
      console.log(id);
      if (id) {
        // Check if the id is not undefined
        this.servicioService.getById(id).subscribe({
          next: (response) => {
            const servicio = response as Servicio;

            this.servicios.push(servicio); // Add each valid servicio object to the array
           
          },
          error: (err) =>
            console.error(`Error fetching servicio with ID: ${id}`, err),
        });
      } else {
        console.error('Encountered undefined service ID.');
      }
    });
  }

  enviar() {
    

    this.reservaService
      .saveReserva(
        this.centro!._id,
        this.form.value.fechaIn,
        this.form.value.fechaOut,
        this.numDias * this.centro!.precioBase + this.sumaServicios,
        0,
        this.selectedServices
      )
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Reserva realizada',
            text: `Tu reserva en nuestro centro en ${
              this.centro!.direccion
            } está listo`,
            icon: 'success',
            timer: 2000,
            didClose: () => {
              this.router.navigateByUrl('/me/my-bookings');
            },
          });
        },
        error: () => {
          Swal.fire({
            title: 'Oops',
            text: 'Ha ocurrido un error con tu reserva',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
        },
      });
  }
}
