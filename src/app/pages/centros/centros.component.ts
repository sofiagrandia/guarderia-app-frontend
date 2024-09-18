import { CentroService } from './../../services/centro.service';
import { Component } from '@angular/core';
import { Centro } from '../../interfaces/centro';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-centros',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './centros.component.html',
  styleUrl: './centros.component.css'
})
export class CentrosComponent {

  centros: Centro[] = []

  constructor(private centroService: CentroService){
    centroService.getAll().subscribe({
      next: (response)=>{
        this.centros = response as Centro[]
      },
      error:() => {}
    })

    
  }

}
