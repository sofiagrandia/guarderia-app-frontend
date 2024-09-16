import { Component } from '@angular/core';
import { ReservaService } from '../../../services/reserva.service';
import { Booking } from '../../../interfaces/booking';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { DivisaPipe } from '../../../pipes/divisa.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [FormatDatePipe, DivisaPipe],
  templateUrl: './reservasAdmin.component.html',
  styleUrl: './reservasAdmin.component.css'
})
export class ReservasAdminComponent {
  reservas: Booking[] = [];

  constructor(private reservaService: ReservaService) {
    reservaService.getAll().subscribe({
      next: (response) => {
        this.reservas = response as Booking[];
      },
      error: () => {},
    });
  }

  eliminar(bookingId: string) {
    console.log(bookingId);
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
        console.log('dentro del then', bookingId);
        this.reservaService.deleteReserva(bookingId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Reserva eliminada!',
              text: 'Tu reserva ha sido eliminada correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });
            //para que visualmente cambie la pantalla aka lo quite del array del front
            this.reservas = this.reservas.filter((x) => x._id !== bookingId);
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
