import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  currentRoute: string = '';


  constructor(public authService: AuthService, private router: Router){
  
  }
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;  // Get the current URL
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;  // Check if the route matches the current URL
  }
 
}
