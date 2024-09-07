import { Component } from '@angular/core';
import { Facility } from '../../../interfaces/facility';
import { FacilityService } from '../../../services/facility.service';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css'
})
export class FacilitiesComponent {

  facilities: Facility[] = []

  constructor(private facilityService: FacilityService){
    facilityService.getAll().subscribe({
      next: (response)=>{
        this.facilities = response as Facility[]
      },
      error:() => {}
    })
  }
}
