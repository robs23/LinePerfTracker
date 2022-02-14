import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import * as secrets from '../secrets';
import { PlannedComponent } from '../interfaces/planned-component';
import { InventorySnapshot } from '../interfaces/inventory-snapshot';
import { DeliveryItem } from '../interfaces/delivery-item';
import { stringify } from '@angular/compiler/src/util';


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

getComponentsScheduleAndDeliveries(scheduleQuery?: string, deliveriesQuery?: string): Observable<any[]>{
  if(scheduleQuery == undefined){
    scheduleQuery = "";
  }else{
    scheduleQuery = "?query=" + scheduleQuery;
  }
  if(deliveriesQuery == undefined){
    deliveriesQuery = "";
  }else{
    deliveriesQuery = "?query=" + deliveriesQuery;
  }

  let scheduleResponse = this.http.get<any[]>(secrets.ApiAddress + 'GetPlannedComponentsSchedule' + scheduleQuery)
  let deliveriesResponse = this.http.get<DeliveryItem[]>(secrets.ApiAddress + 'GetDeliveryItems' + deliveriesQuery);
  
  return forkJoin([scheduleResponse, deliveriesResponse]);
}

}
