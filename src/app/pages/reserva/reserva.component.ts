import { User } from './../../interfaces/user';
import { CentroService } from './../../services/centro.service';
import { ReservaService } from './../../services/reserva.service';
import { ChangeDetectorRef, Component } from '@angular/core';
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
import { Mascota } from '../../interfaces/mascota';
import { UserService } from '../../services/user.service';
import { MascotaService } from '../../services/mascota.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, DivisaPipe, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent {
  public PROMO_CODE_10='PET10';
  centro: Centro | null = null;
  servicio: Servicio | null = null;
  form!: FormGroup;
  mostrarCodigoPromocional: boolean = false;
  selectedServices: Servicio[] = [];
  parametro: string | null = null;
  servicios: Servicio[] = [];
  sumaServicios: number = 0;
  mascotas: Mascota[] = [];
  selectedMascotas: Mascota[] = [];
  numMascotas: number = 0;
  userId: string | string = '';
  codigoPromocional: string | string = '';
  //Esto normalmente estaría en BBDD, se recuperarían los códigos con servicio y se compararían, es solo para ver el fucnionamiento de validación de promos
  promoCodesList: string[] = [this.PROMO_CODE_10];
  dateError: boolean | boolean=false;
  

  constructor(
    private reservaService: ReservaService,
    private router: Router,
    private builder: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private centroService: CentroService,
    private servicioService: ServicioService,
    private userService: UserService,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef
  ) {
    let data: BookingFormData = {
      startDate: null,
      endDate: null,
      promoCode: null,
    };
    this.loadUser();
    
    if (cookieService.check('booking-form-data')) {
      data = JSON.parse(cookieService.get('booking-form-data'));
    }
    if (this.cookieService.check('user')) {
      console.log("cookie service user", JSON.parse(this.cookieService.get('user')));
      this.userId = JSON.parse(this.cookieService.get('user')).id;
    }

    this.form = builder.group({
      fechaIn: new FormControl(data.startDate, [Validators.required]),
      fechaOut: new FormControl(data.endDate, [Validators.required]),
      codigoPromocional: new FormControl([]),
    });

    route.paramMap.subscribe((params) => {
      this.parametro = params.get('id');
    });
    this.validateDates();
    this.form.controls['fechaIn'].valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.form.controls['fechaOut'].valueChanges.subscribe(() => {
      this.validateDates();
    });
    if (this.parametro !== null) {
      console.log('centro: ', centroService.getById(this.parametro));
      centroService.getById(this.parametro).subscribe({
        next: (response) => {
          console.log(response);
          this.centro = response as Centro;
          this.loadMascotas();
          this.loadUser();
          console.log('centro id', this.centro._id);
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


  ngAfterContentChecked() {
    // Trigger change detection after view is fully initialized
    
    this.validateDates();
    this.cdr.detectChanges();
  }

  public get numDias(): number {
    let fechaInStr = this.form.value.fechaIn;
    let fechaOutStr = this.form.value.fechaOut;
    /*if (!fechaInStr || !fechaOutStr) {
      this.dateError=true;
      return 0;
    }*/

    let fechaini = new Date(fechaInStr);
    let fechafin = new Date(fechaOutStr);

    /*let correctDates = fechafin<fechaini;
    if (isNaN(fechaini.getTime()) || isNaN(fechafin.getTime()) || correctDates) {
      console.error('Invalid date(s) provided');
      this.dateError=true;
      return 0;
    }*/
    if(fechafin.getDate()==fechaini.getDate()){
      return 1;
    }
    let millisDif = fechafin.getTime() - fechaini.getTime();
    let dias = millisDif / 1000 / 60 / 60 / 24;
    this.dateError=false;
    
    return dias < 0 ? 0 : dias;
  }

  public validateDates() {
    const fechaInStr = this.form.value.fechaIn;
    const fechaOutStr = this.form.value.fechaOut;
    let fechaini = new Date(fechaInStr);
    let fechafin = new Date(fechaOutStr);
    let incorrectDates = fechafin<fechaini;
  
    if (!fechaInStr || !fechaOutStr || new Date(fechaInStr) > new Date(fechaOutStr) ||isNaN(fechaini.getTime()) || isNaN(fechafin.getTime()) || incorrectDates) {
      this.dateError = true;
    }
  }

  public get promoCode(): number{
    const promoCode = this.form.value.codigoPromocional;
    this.codigoPromocional = this.form.value.codigoPromocional;
    if(promoCode==this.PROMO_CODE_10){
      console.log("this calc", this.codigoPromocional)
      return 0.9;
    }else{
      return 1;
    }
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
      
    }else {
      console.error('User is not logged in');
    }
    
    /*if (this.authService.user) {
      this.userId = this.authService.id;
      console.error('this.USerId en load', this.authService.id);
    } else {
      console.error('User is not logged in');
    }*/
    
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

  onMascotaToggle(mascota: Mascota, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Add the service to the list if it is checked
      this.selectedMascotas.push(mascota);
      this.numMascotas = +this.selectedMascotas.length;
      console.log('numMascotas', this.numMascotas);
    } else {
      // Remove the service from the list if it is unchecked
      this.selectedMascotas = this.selectedMascotas.filter(
        (m) => m._id !== mascota._id
      );
      this.numMascotas--;
    }
  }

  // Function to load mascotas of the logged-in user
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
    console.log('Centro enviado', this.centro?._id);
    console.log('servicios enviado', this.selectedServices);
    console.log("Usuario: ", this.userId);
    const token = this.cookieService.get('token'); // Assuming token is stored in cookies after login
  
  const headers = { 'Authorization': `Bearer ${token}` };
  
    this.reservaService
      .saveReserva(
        this.centro!._id,
        this.form.value.fechaIn,
        this.form.value.fechaOut,
        (this.numDias * this.centro!.precioBase + this.sumaServicios) *
          this.selectedMascotas.length * this.promoCode,
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
        error: (err) => {
          Swal.fire({
            title: 'Oops',
            text: `Ha ocurrido un error con tu reserva ${
              err.error.message || 'Unknown error'
            }`,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
        },
      });
  }
}
