import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    console.log('createDb() triggered!');
    
    const employees = [
      {
        id: 1,
        firstName: 'Budi',
        lastName: 'Setiawan',
        gender: 'Laki-Laki',
        contactNumber: 1234567890
      },
      {
        id: 2,
        firstName: 'Lili',
        lastName: 'Lulu',
        gender: 'Perempuan',
        contactNumber: 5552525235
      },
      {
        id: 3,
        firstName: 'Akmad',
        lastName: 'Badui',
        gender: 'Laki-Laki',
        contactNumber: 5325352352
      }
    ];
    return {employees};
    // return {heroes};
  }

  genId(employees: any[]): number {
    return employees.length > 0 ? Math.max(...employees.map(employee => employee.id)) + 1 : 11;
  }
}





// const heroes = [
//   { id: 11, name: 'Dr Nice' },
//   { id: 12, name: 'Narco' },
//   { id: 13, name: 'Bombasto' },
//   { id: 14, name: 'Celeritas' },
//   { id: 15, name: 'Magneta' },
//   { id: 16, name: 'RubberMan' },
//   { id: 17, name: 'Dynama' },
//   { id: 18, name: 'Dr IQ' },
//   { id: 19, name: 'Magma' },
//   { id: 20, name: 'Tornado' }
// ];

// Overrides the genId method to ensure that a hero always has an id.
// If the heroes array is empty,
// the method below returns the initial number (11).
// if the heroes array is not empty, the method below returns the highest
// hero id + 1.

// genId(heroes: Hero[]): number {
//   return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
// }