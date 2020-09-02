import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, of, timer, Subscription } from 'rxjs';
import { ScanningItemService } from '../services/scanningItem.service';
import { ScanningItem } from '../scanningItem';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { MachineComponent } from '../machine/machine.component';

@Component({
  selector: 'app-scanningItems',
  templateUrl: './scanningItems.component.html',
  styleUrls: ['./scanningItems.component.css']
})
export class ScanningItemsComponent implements OnInit, OnDestroy {
  @Input() MachineId: number;
  ScanningItems: ScanningItem[];
  displayedColumns: string[] = ['Date', 'ScanningHour', 'Quantity', 'QuantityKg', 'FoilLossPercentage', 'Speed', 'ChangeOvers'];
  subscription: Subscription;

  constructor(private scanningItemService: ScanningItemService) { }

  ngOnInit() {
    this.subscription = timer(0, 60000).pipe(
      switchMap(() => this.scanningItemService.getScanningItems(this.MachineId))).subscribe(response => this.ScanningItems = response);
  }

  getScanningItems(): void{
    this.scanningItemService.getScanningItems(this.MachineId).subscribe(response => this.ScanningItems = response);
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  }

