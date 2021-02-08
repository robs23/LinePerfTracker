import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { VirtualTruck } from '../interfaces/virtual-truck';

@Component({
  selector: 'app-virtual-truck-items',
  templateUrl: './virtual-truck-items.component.html',
  styleUrls: ['./virtual-truck-items.component.css']
})
export class VirtualTruckItemsComponent implements OnInit {
  VT: VirtualTruck;
  displayedColumns: string[] = ['START_DATE', 'STOP_DATE','PRODUCT_NR', 'PAL','Divider', 'MACHINE_NAME', 'ORDER_NR'];

  constructor(public dialogRef: MatDialogRef<VirtualTruckItemsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    
  }

  ngOnInit() {
    this.VT = this.data[0];
  }
  

}
