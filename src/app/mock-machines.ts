import { Machine } from './machine';
import { Identifiers } from '@angular/compiler';

export const MACHINES: Machine[] = [
    {id: 1, name: 'Linia 01', state: 'PR'},
    {id: 2, name: 'Linia 02', state: 'PR'},
    {id: 3,  name: 'Linia 03', state: 'ST'},
    {id: 14, name: 'Linia 14', state: 'PR'},
    {id: 15, name: 'Linia 15', state: 'ST'}
]