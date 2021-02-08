import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VirtualTruck } from '../interfaces/virtual-truck';
import { VirtualTruckItemsComponent } from '../virtual-truck-items/virtual-truck-items.component';
import * as secrets from '../secrets';

@Injectable({
  providedIn: 'root'
})
export class VirtualTruckService {

constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

openItemsPage(virtualTruck): MatDialogRef<VirtualTruckItemsComponent> {
  const dialogRef = this.dialog.open(VirtualTruckItemsComponent,
    {
      data: virtualTruck
  });
  return dialogRef;
};

closeItemsPage(ref:MatDialogRef<VirtualTruckItemsComponent>){
  ref.close();
}

getVirtualTrucks(query?: string): Observable<VirtualTruck[]>{
  if(query == undefined){
    return this.http.get<VirtualTruck[]>(secrets.ApiAddress + 'GetVirtualTrucks');
  }else{
    return this.http.get<VirtualTruck[]>(secrets.ApiAddress + 'GetVirtualTrucks?query=' + query);
  }
}

}
