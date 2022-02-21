import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import * as secrets from '../secrets';
import { PlannedComponent } from '../interfaces/planned-component';
import { InventorySnapshot } from '../interfaces/inventory-snapshot';
import { DeliveryItem } from '../interfaces/delivery-item';
import { stringify } from '@angular/compiler/src/util';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlannedComponentScheduleComponent } from '../planned-component-schedule/planned-component-schedule.component';


@Injectable({
  providedIn: 'root'
})
export class PlannedComponentsService {

constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

openComponentSchedulePage(componentSchedule): MatDialogRef<PlannedComponentScheduleComponent> {
  const dialogRef = this.dialog.open(PlannedComponentScheduleComponent,
    {
      data: componentSchedule
  });
  return dialogRef;
};

closeComponentSchedulePage(ref:MatDialogRef<PlannedComponentScheduleComponent>){
  ref.close();
}

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
