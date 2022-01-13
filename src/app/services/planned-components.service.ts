import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as secrets from '../secrets';
import { PlannedComponent } from '../interfaces/planned-component';

@Injectable({
  providedIn: 'root'
})
export class PlannedComponentsService {

constructor(private http: HttpClient) { }

getPlannedComponents(query?: string): Observable<PlannedComponent[]>{
  if(query == undefined){
    return this.http.get<PlannedComponent[]>(secrets.ApiAddress + 'GetPlannedComponents');
  }else{
    return this.http.get<PlannedComponent[]>(secrets.ApiAddress + 'GetPlannedComponents?query=' + query);
  }
  
}

}
