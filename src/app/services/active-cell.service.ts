import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeliveryPreviewComponent } from '../delivery-preview/delivery-preview.component';
import { Delivery } from '../interfaces/delivery';

@Injectable({
  providedIn: 'root'
})
export class ActiveCellService {
  colId: string;
  rowIndex: number;
  delivery: Delivery;
  deliveryPreviewRef;

constructor(private router: Router, private dialog: MatDialog) { }

openDeliveryPreview(delivery: Delivery): MatDialogRef<DeliveryPreviewComponent> {
  const dialogRef = this.dialog.open(DeliveryPreviewComponent,
    {
      data: delivery
  });
  return dialogRef;
};

closeDeliveryPreview(ref:MatDialogRef<DeliveryPreviewComponent>){
  ref.close();
}

onCellMouseOver(colId: string, rowIndex: number, delivery: Delivery): void{
  this.colId = colId;
  this.rowIndex = rowIndex;
  this.delivery = delivery;

  setTimeout(() => {
      if(this.colId == colId && this.rowIndex==rowIndex){
          //it's still the same cell
          console.log(`Aktywna kolumna: ${colId}, aktywny wiersz: ${rowIndex}`);
          
          // if(this.DeliveryItems != undefined){
          //   if(this.DeliveryItems.)
          // }

          this.deliveryPreviewRef = this.openDeliveryPreview(this.delivery);
      }
  }, 2000);
}

onCellMouseOut(): void{
  this.colId = undefined;
  this.rowIndex = undefined;
}

}
