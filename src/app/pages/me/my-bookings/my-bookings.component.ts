import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Booking } from '../../../interfaces/booking';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { DivisaPipe } from '../../../pipes/divisa.pipe';
import { AuthService } from '../../../services/auth.service';
import Swal from "sweetalert2"
import { CanCancelPipe } from '../../../pipes/can-cancel.pipe';
import { ReservaService } from '../../../services/reserva.service';


@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [FormatDatePipe,DivisaPipe,CanCancelPipe],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  bookings: Booking[] = [];
  userId: string | string = '';

  constructor(private reservaService: ReservaService, private authService: AuthService, private cookieService: CookieService){
    this.loadUser()
    console.log("this.userId",this.userId);
    
    this.reservaService.getReservaByUserId(this.userId).subscribe({
      next: (response)=>{
        this.bookings = response as Booking[]
      },
      error: ()=>{

      }
    })
  }

  loadUser() {
    if (!this.authService.user && this.cookieService.check('user')) {
      this.authService.user = JSON.parse(this.cookieService.get('user'));
      this.userId = JSON.parse(this.cookieService.get('user')).id;
    }
    if (this.cookieService.check('user')) {
      console.log("cookie service user", JSON.parse(this.cookieService.get('user')));
      this.authService.user = JSON.parse(this.cookieService.get('user'));

      if(JSON.parse(this.cookieService.get('user')).id){
        this.userId = JSON.parse(this.cookieService.get('user')).id;
      }else{
        this.userId = JSON.parse(this.cookieService.get('user'))._id;
      }
      //console.log(this.authService.user?.token);
    }else {
      console.error('User is not logged in');
    }
  }
  eliminar(bookingId: string){
    console.log(bookingId);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
      
      
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("dentro del then",bookingId);
        this.reservaService.deleteReserva(bookingId).subscribe({
          next: ()=>{
            Swal.fire({
              title: "¡Reserva eliminada!",
              text: "Tu reserva ha sido eliminada correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            //para que visualmente cambie la pantalla aka lo quite del array del front
            this.bookings = this.bookings.filter(x=>x._id !== bookingId)
          },
          error:()=>{
            Swal.fire({
              title: "Oops!",
              text: "Ha ocurrido un error",
              icon: "error",
              showConfirmButton: false,
              timer: 1500
            })
          }
        })

        
      }
    });
  }

  editar(bookingId: string){
    const reservaEditar: Booking|undefined = this.bookings.find(x=>x._id === bookingId)
    if(reservaEditar){
      Swal.fire({
      /*title: `Tu reserva del ${reservaEditar.vehicle.brand} ${reservaEditar.vehicle.model}`,*/
      html: `<div>
        <div>
          <label class="form-label">Fecha inicio</label>
          <input type="date" class="form-control">
        </div>
        <div>
        <label class="form-label">Fecha fin</label>
        <input type="date" class="form-control">
      </div>
      </div>`,
      didClose: ()=>{
        // update de la reserva
      }
      })
    }
    
  }
}
