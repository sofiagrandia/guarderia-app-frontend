import { ReservaService } from './../../services/reserva.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Centro } from '../../interfaces/centro';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DivisaPipe } from '../../pipes/divisa.pipe';
import { AuthService } from '../../services/auth.service';
import { Servicio } from '../../interfaces/servicio';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, DivisaPipe],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent {
  centro: Centro | null = null;
  form!: FormGroup;
  mostrarCodigoPromocional: boolean = false;
  selectedServices: Servicio[] = [];


  constructor(
    private reservaService: ReservaService,
    private router: Router,
    public authService: AuthService
  ) {}

  public get numDias(): number {
    const fechaini = new Date(this.form.value.fechaInicio);
    const fechafin = new Date(this.form.value.fechaFin);

    const millisDif = fechafin.getTime() - fechaini.getTime();
    const dias = millisDif / 1000 / 60 / 60 / 24;
    if (dias < 0) {
      return 0;
    } else {
      return dias;
    }
  }

  onServiceToggle(servicio: Servicio, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Add the service to the list if it is checked
      this.selectedServices.push(servicio);
    } else {
      // Remove the service from the list if it is unchecked
      this.selectedServices = this.selectedServices.filter(s => s._id !== servicio._id);
    }
  }

  enviar() {
    this.reservaService
      .saveReserva(
        this.centro!._id,
        this.form.value.fechaIn,
        this.form.value.fechaOut,
        this.numDias * this.centro!.precioBase,
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
