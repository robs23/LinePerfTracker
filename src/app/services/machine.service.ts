import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MACHINES } from '../mock-machines';
import { Machine } from '../machine';
import { MachineComponent } from '../machine/machine.component';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor() { }

  getMachines(): Observable<Machine[]>{
    return of(MACHINES);
  }

  getMachine(id: number): Observable<Machine>{
    return of(MACHINES.find(mach => mach.id === id));
  }
}
