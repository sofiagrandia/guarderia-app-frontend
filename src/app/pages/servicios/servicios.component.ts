import { Component } from '@angular/core';
import { Servicio } from '../../interfaces/servicio';
import { ServicioService } from '../../services/servicio.service';
import { DivisaPipe } from '../../pipes/divisa.pipe';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [DivisaPipe],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {

  servicios: Servicio[] = []

  constructor(private servicioService: ServicioService){
    servicioService.getAll().subscribe({
      next: (response)=>{
        this.servicios = response as Servicio[]
      },
      error:() => {}
    })
  }

}
