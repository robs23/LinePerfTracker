import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftItem } from '../shiftItem';
import { ScanningItemsTransformer } from '../scanning-items-transformer'; 

@Component({
  selector: 'app-shift-view',
  templateUrl: './shift-view.component.html',
  styleUrls: ['./shift-view.component.css']
})
export class ShiftViewComponent implements OnInit {
  @Input() scanningItems;
  @Output() shiftItemsChanged = new EventEmitter<ShiftItem[]>();
  items: ShiftItem[];
  private scanningItemsTransformer = new ScanningItemsTransformer();
  displayedColumns: string[] = ['Date', 'Name', 'ScanningHourFirst', 'ScanningHourLast', 'WorkingHours' , 'ConfirmedKg', 'Quantity', 'QuantityKg' , 'FoilLossPercentage', 'Contaminated',  'Speed', 'GE', 'ChangeOvers', 'Zfins'];  
  constructor() { }

  ngOnInit() {
    this.prepareData();
  }

  prepareData(): void{
    this.items = this.scanningItemsTransformer.toShiftView(this.scanningItems);
    this.items = this.items.reverse();
    this.shiftItemsChanged.emit(this.items);
  }

}
