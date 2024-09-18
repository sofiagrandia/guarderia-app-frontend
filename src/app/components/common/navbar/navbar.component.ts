import { UserService } from './../../../services/user.service';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  currentRoute: string = '';
  userRole: string | string = '';
  user: User | null = null;
  userId: string | string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    public userService: UserService,
    public cookieService: CookieService
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Get the current URL
    });
    this.loadUser();
    this.getRole();
   
    
  }

  isActive(route: string): boolean {
    return this.currentRoute === route; // Check if the route matches the current URL
  }
  loadUser() {
    if (!this.authService.user && this.cookieService.check('user')) {
      this.authService.user = JSON.parse(this.cookieService.get('user'));
      this.userId = JSON.parse(this.cookieService.get('user')).id;
    }
    if (this.cookieService.check('user')) {
      console.log(
        'cookie service user',
        JSON.parse(this.cookieService.get('user'))
      );
      this.authService.user = JSON.parse(this.cookieService.get('user'));
      if (JSON.parse(this.cookieService.get('user')).id) {
        this.userId = JSON.parse(this.cookieService.get('user')).id;
      } else {
        this.userId = JSON.parse(this.cookieService.get('user'))._id;
      }
    } else {
      console.error('User is not logged in');
    }
  }
  getRole() {
    console.log(this.userId);
    this.userService.getById(this.userId).subscribe({
      next: (response) => {
        console.log(response);
        this.user = response as User;
        console.log(this.user);
        if(this.user.role!=null){
          this.userRole = this.user.role;
        }
        
      },
      error: (err) => {
        console.error('error al cargar tipo de usuario', err);
      },
    });
  }
}
