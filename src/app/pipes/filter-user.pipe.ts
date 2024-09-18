
import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user';

@Pipe({
  name: 'filterUser',
  standalone: true
})
export class FilterUserPipe implements PipeTransform {

  transform(value: User[], filtro: string): User[] {
    return value.filter(x=> x._id.toLowerCase().includes(filtro.toLowerCase()) || x.name?.toLocaleLowerCase().includes(filtro.toLowerCase()))
  }

}
