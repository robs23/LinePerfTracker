import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as secrets from '../secrets';
import { PlannedComponent } from '../interfaces/planned-component';
import { InventorySnapshot } from '../interfaces/inventory-snapshot';
import { DeliveryItem } from '../interfaces/delivery-item';


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

getInventorySnapshots(query?: string): Observable<InventorySnapshot[]>{
  if(query == undefined){
    return this.http.get<InventorySnapshot[]>(secrets.ApiAddress + 'GetInventorySnapshots');
  }else{
    return this.http.get<InventorySnapshot[]>(secrets.ApiAddress + 'GetInventorySnapshots?query=' + query);
  }
  
}

getDeliveryItems(query?: string): Observable<DeliveryItem[]>{
  if(query == undefined){
    return this.http.get<DeliveryItem[]>(secrets.ApiAddress + 'GetDeliveryItems');
  }else{
    return this.http.get<DeliveryItem[]>(secrets.ApiAddress + 'GetDeliveryItems?query=' + query);
  }
  
}

}
