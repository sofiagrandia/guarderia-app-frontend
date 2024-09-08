import { Component } from '@angular/core';
import { Servicio } from '../../interfaces/servicio';
import { ServicioService } from '../../services/servicio.service';
import { DivisaPipe } from '../../pipes/divisa.pipe';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [DivisaPipe],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent {
  servicios: Servicio[] = [];

  constructor(private servicioService: ServicioService) {
    servicioService.getAll().subscribe({
      next: (response) => {
        this.servicios = response as Servicio[];

        // Modify the attribute for each servicio in the array
        this.servicios = this.servicios.map((servicio) => {
          // Modify any attribute, for example setting a new precio
          servicio.description = this.modifyText(servicio.description);
          return servicio; // return the modified servicio
        });
      },
      error: () => {},
    });
  }

  modifyText(text: string): string {
    return text.replace(/\\n/g, '<br><br>');
  }
}
