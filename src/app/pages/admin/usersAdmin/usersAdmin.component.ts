import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FilterUserPipe } from '../../../pipes/filter-user.pipe';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, FilterUserPipe],
  templateUrl: './usersAdmin.component.html',
  styleUrl: './usersAdmin.component.css'
})
export class UsersAdminComponent {
  users: User[] = [];
  filtro: string = "";

  constructor(private userService: UserService) {
    userService.getAll().subscribe({
      next: (response) => {
        this.users = response as User[];
        console.log(response)
      },
      error: () => {},
    });
  }

  eliminar(userId: string) {
    console.log(userId);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('dentro del then', userId);
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Usuario eliminado!',
              text: 'El usuario ha sido eliminado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });
            //para que visualmente cambie la pantalla aka lo quite del array del front
            this.users = this.users.filter((x) => x._id !== userId);
          },
          error: () => {
            Swal.fire({
              title: 'Oops!',
              text: 'Ha ocurrido un error',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        });
      }
    });
  }
}
