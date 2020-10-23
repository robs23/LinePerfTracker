import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, of, timer, Subscription } from 'rxjs';
import { ScanningItemService } from '../services/scanningItem.service';
import { ScanningItem } from '../scanningItem';
import { switchMap, takeUntil, catchError, finalize } from 'rxjs/operators';
import { MachineComponent } from '../machine/machine.component';
import { UserInteractionService } from '../services/userInteraction.service';
import { Span, RowSpanComputer } from '../row-span-computer';

@Component({
  selector: 'app-scanningItems',
  templateUrl: './scanningItems.component.html',
  styleUrls: ['./scanningItems.component.css']
})
export class ScanningItemsComponent implements OnInit, OnDestroy {
  @Input() MachineId: number;
  ScanningItems: ScanningItem[];
  rowSpans: Array<Span[]>;
  private rowSpanComputer = new RowSpanComputer();
  displayedColumns: string[] = ['Date', 'ScanningHour', 'Zfin', 'ConfirmedKg', 'Contaminated', 'Quantity', 'QuantityKg' , 'FoilLossPercentage', 'Speed', 'SpeedDiff', 'ChangeOvers'];
  columnNames: string[] = ['Zfin', 'ConfirmedKg', 'Contaminated', 'Date', 'ScanningHour', 'Quantity', 'QuantityKg' , 'FoilLossPercentage', 'Speed', 'SpeedDiff', 'ChangeOvers'];
  lastColumnName: string;
  allButLastColumnNames: string[];
  subscription: Subscription;
  autoUpdateSub: Subscription;

  constructor(private scanningItemService: ScanningItemService, private userInteractionService: UserInteractionService) { 
    this.autoUpdateSub = userInteractionService.autoUpdateClicked$.subscribe(
      value => {
        if(value){
          //auto update on
          this.subscription = timer(0, 60000).pipe(
            switchMap(() => this.scanningItemService.getScanningItems(this.MachineId)),
            catchError(err => of([]))).subscribe(response => this.ScanningItems = response);
          
        }else{
          //auto update off
          this.subscription.unsubscribe();
        }
      }
    );
  }

  ngOnInit() {
    this.subscription = timer(0, 60000).pipe(
      switchMap(() => this.scanningItemService.getScanningItems(this.MachineId)),
      catchError(err => of([]))).subscribe(response => {
        this.ScanningItems = response;
        this.computeRowSpans();}
        );
  }

  getScanningItems(): void{
    this.scanningItemService.getScanningItems(this.MachineId).subscribe(response => this.ScanningItems = response);
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  private computeRowSpans(): void{
    this.lastColumnName = this.displayedColumns[this.displayedColumns.length - 1];
    this.allButLastColumnNames = this.displayedColumns.slice(0, -1);
    this.rowSpans = this.rowSpanComputer.compute(this.ScanningItems, this.columnNames);
  }

  }

