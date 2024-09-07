import { ClassService } from './../../../services/class.service';
import { Component } from '@angular/core';
import { Class } from '../../../interfaces/class';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent {

  classes: Class[] = []

  constructor(private classService: ClassService){
    classService.getAll().subscribe({
      next: (response)=>{
        this.classes = response as Class[]
      },
      error:() => {}
    })
  }
}
