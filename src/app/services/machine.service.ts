import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MACHINES } from '../mock-machines';
import { Machine } from '../machine';
import { MachineComponent } from '../machine/machine.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as secrets from '../secrets';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(
    private http: HttpClient
  ) { }

  getMachines(): Observable<Machine[]>{
    return this.http.get<Machine[]>(secrets.ApiAddress + 'GetMachines?Type=3&VisibleInAPS=true');
  }

  getMachine(id: number): Observable<Machine>{
    return this.http.get<Machine>(secrets.ApiAddress + 'GetMachine?Id=' + id);
  }
}
