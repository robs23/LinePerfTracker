import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MACHINES } from '../mock-machines';
import { Machine } from '../machine';
import { MachineComponent } from '../machine/machine.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as secrets from '../secrets';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private machinesUrl = secrets.TestApiAddress + 'GetMachines?Type=3&VisibleInAPS=true';
  constructor(
    private http: HttpClient
  ) { }

  getMachines(): Observable<Machine[]>{
    return this.http.get<Machine[]>(this.machinesUrl);
  }

  getMachine(id: number): Observable<Machine>{
    return of(MACHINES.find(mach => mach.id === id));
  }
}
