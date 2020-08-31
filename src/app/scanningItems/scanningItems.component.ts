import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ScanningItemService } from '../services/scanningItem.service';
import { ScanningItem } from '../scanningItem';

@Component({
  selector: 'app-scanningItems',
  templateUrl: './scanningItems.component.html',
  styleUrls: ['./scanningItems.component.css']
})
export class ScanningItemsComponent implements OnInit {
  @Input() MachineId: number;
  ScanningItems: ScanningItem[];
  displayedColumns: string[] = ['Date', 'ScanningHour', 'Quantity', 'QuantityKg', 'Speed', 'ChangeOvers'];
  constructor(private scanningItemService: ScanningItemService) { }

  ngOnInit() {
    this.getScanningItems();
  }

  getScanningItems(): void{
    this.scanningItemService.getScanningItems(this.MachineId).subscribe(response => this.ScanningItems = response);
  }

  }

