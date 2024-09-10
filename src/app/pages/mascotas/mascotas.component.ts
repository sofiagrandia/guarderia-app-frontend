import { Mascota } from './../../interfaces/mascota';
import { Component } from '@angular/core';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [],
  templateUrl: './mascotas.component.html',
  styleUrl: './mascotas.component.css'
})
export class MascotasComponent {
  mascotas: Mascota[] = [];
  constructor(private mascotaService: MascotaService){
    mascotaService.getAll().subscribe({
      next: (response) => {
        this.mascotas = response as Mascota[];
  
        // Modify the attribute for each servicio in the array
        this.mascotas = this.mascotas.map((mascota) => {
          
          return mascota; // return the modified servicio
        });
      },
      error: () => {},
    });
  }
  

}
