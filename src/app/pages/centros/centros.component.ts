import { Servicio } from './../../interfaces/servicio';
import { CentroService } from './../../services/centro.service';
import { Component } from '@angular/core';
import { Centro } from '../../interfaces/centro';
import { Router, RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centros',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './centros.component.html',
  styleUrl: './centros.component.css'
})
export class CentrosComponent {

  centros: Centro[] = []
  servicios: Servicio[] = []
  centro: Centro | null = null;
  serviciosMap: { [centroId: string]: Servicio[] } = {};
  loadedServiceIds: Set<string> = new Set(); 

  constructor(private centroService: CentroService, private servicioService: ServicioService,  private router: Router, private authService: AuthService){
    centroService.getAll().subscribe({
      next: (response)=>{
        this.centros = response as Centro[];
        for(let c of this.centros){
          centroService.getById(c._id).subscribe({
            next: (response) => {
              console.log(response);
              this.centro = response as Centro;
              if (this.centro.servicios && this.centro.servicios.length > 0) {
                const servicioIds = this.centro.servicios;
                
                // Initialize an empty array if not already done
                if (!this.serviciosMap[this.centro._id]) {
                  this.serviciosMap[this.centro._id] = [];
                }

                this.loadServicios(this.centro._id, servicioIds);
              }
            },
            error: () => {},
          });
        }
     
      },
      error:() => {}
    })

    
  }

  loadServicios(centroId: string, servicioIds: string[]) {
    servicioIds.forEach((id) => {
      if (id && !this.serviciosMap[centroId].find(s => s._id === id)) {
        // Only fetch the servicio if it hasn't been added to the map for this centro
        this.servicioService.getById(id).subscribe({
          next: (response) => {
            const servicio = response as Servicio;
            this.serviciosMap[centroId].push(servicio); // Add to the map
          },
          error: (err) => console.error(`Error fetching servicio with ID: ${id}`, err),
        });
      }
    });
  }

  clickCenter(centroId: String){
    if(!this.authService.user){
      console.log("Usuario no encontrado")
      Swal.fire({
        title: "No está registrado",
        text: "Para completar su reserva inicie sesión",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34d8eb",
        cancelButtonColor: "#2a1cad",
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Dejar para más tarde",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/login');
        }
      });
    }else{
      this.router.navigateByUrl(`/reserva/${centroId}`);
    }
    

  }


}
