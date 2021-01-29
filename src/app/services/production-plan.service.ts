import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DividerItem } from '../interfaces/divider-item';
import * as secrets from '../secrets';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class ProductionPlanService {

constructor(private http: HttpClient) { }

getProductionPlanByLocation(query?: string): Observable<Location[]>{
  if(query == undefined){
    return this.http.get<Location[]>(secrets.ApiAddress + 'GetProductionPlanByDestinations');
  }else{
    return this.http.get<Location[]>(secrets.ApiAddress + 'GetProductionPlanByDestinations?query=' + query);
  }
  
}

}
