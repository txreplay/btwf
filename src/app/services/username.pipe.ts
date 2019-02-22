import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'username'})
export class UsernamePipe implements PipeTransform {
  transform(value: string, type: 'id'|'name'): string {
    const username = value.split('#');

    return (type === 'name') ? username[0] : (type === 'name') ? username[1] : 'N/A';
  }
}
