import { Servicio } from './../../interfaces/servicio';
import { CentroService } from './../../services/centro.service';
import { Component } from '@angular/core';
import { Centro } from '../../interfaces/centro';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';

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

  constructor(private centroService: CentroService, private servicioService: ServicioService){
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


}
