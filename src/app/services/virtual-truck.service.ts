import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VirtualTruck} from '../interfaces/virtual-truck'
import * as secrets from '../secrets';

@Injectable({
  providedIn: 'root'
})
export class VirtualTruckService {

constructor(private http: HttpClient) { }

getVirtualTrucks(query?: string): Observable<VirtualTruck[]>{
  if(query == undefined){
    return this.http.get<VirtualTruck[]>(secrets.ApiAddress + 'GetVirtualTrucks');
  }else{
    return this.http.get<VirtualTruck[]>(secrets.ApiAddress + 'GetVirtualTrucks?query=' + query);
  }
  
}
}
