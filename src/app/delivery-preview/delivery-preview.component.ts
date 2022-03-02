import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Delivery } from '../interfaces/delivery';

@Component({
  selector: 'app-delivery-preview',
  templateUrl: './delivery-preview.component.html',
  styleUrls: ['./delivery-preview.component.scss']
})
export class DeliveryPreviewComponent implements OnInit {

  delivery: Delivery;

  constructor(public dialogRef: MatDialogRef<DeliveryPreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.delivery = this.data;
  }


}
