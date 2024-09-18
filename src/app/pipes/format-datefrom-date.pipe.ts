import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDatefromDate',
  standalone: true
})
export class FormatDatefromDatePipe implements PipeTransform {
  transform(value: Date | string): string {
  let date: Date;

  // Convert string to Date if necessary
  if (typeof value === 'string') {
    date = new Date(value);
  } else {
    date = value;
  }

  // Ensure date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Extract date parts
  let day = date.getDate(); // getDate() gives the day of the month
  let month = date.getMonth() + 1; // getMonth() returns 0-based month
  let year = date.getFullYear();

  // Format and return the date string
  return `${day}/${month}/${year}`;
}
}