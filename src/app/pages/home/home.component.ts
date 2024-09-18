import { Component } from '@angular/core';
import { Vehicle } from '../../interfaces/vehicle';
import { VehicleService } from '../../services/vehicle.service';
import { DivisaPipe } from '../../pipes/divisa.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterVehiclesPipe } from '../../pipes/filter-vehicles.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  //routerModule para poder poner RouterLink en el html
  imports: [DivisaPipe, RouterModule, FormsModule, FilterVehiclesPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //Hay que crear una interfaz para poder traer Vehiculos
  

  constructor(){
    
  }
}
