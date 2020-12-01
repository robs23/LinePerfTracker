import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, of, timer, Subscription, interval } from 'rxjs';
import { ScanningItemService } from '../services/scanningItem.service';
import { ScanningItem } from '../scanningItem';
import { switchMap, takeUntil, catchError, finalize } from 'rxjs/operators';
import { MachineComponent } from '../machine/machine.component';
import { UserInteractionService } from '../services/userInteraction.service';
import { Span, RowSpanComputer } from '../row-span-computer';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import * as XLSX from 'xlsx'; 
import { SpinnerService } from '../services/spinner.service';
import { MatDialogRef } from '@angular/material/dialog';

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
  displayedColumns: string[] = ['Date', 'ScanningHour', 'Zfin', 'ConfirmedKg', 'Contaminated', 'Quantity', 'QuantityKg' , 'FoilLossPercentage', 'FoilLossPercentageDiff', 'Speed', 'GE', 'ChangeOvers'];
  columnNames: string[] = ['Zfin', 'ConfirmedKg', 'Contaminated', 'Date', 'ScanningHour', 'Quantity', 'QuantityKg' , 'FoilLossPercentage', 'FoilLossPercentageDiff', 'Speed', 'GE', 'ChangeOvers'];
  lastColumnName: string;
  allButLastColumnNames: string[];
  subscription: Subscription;
  autoUpdateSub: Subscription;
  tabSwitchClickedSub: Subscription;
  tabSwitchSub: Subscription;
  selectedTab: number = 0;
  tabsToSwitch: number[] = [0, 1, 2];
  tabSwitchSource = interval(10000); //emit value in sequence every 10 second
  exportButtonClickedSub: Subscription;

  constructor(private scanningItemService: ScanningItemService, private userInteractionService: UserInteractionService, private spinnerService: SpinnerService) {
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
    this.tabSwitchClickedSub = userInteractionService.tabSwitchClicked$.subscribe(
      value => {
        if(value){
          //tab switch on
          this.tabSwitchSub = this.tabSwitchSource.subscribe(() => this.nextTab());
        }else{
          //tab switch off
          this.tabSwitchSub.unsubscribe();
        }
      }
    );
    this.exportButtonClickedSub = userInteractionService.exportClicked$.subscribe(
      value => {
        //this.exportToExcel();
        this.jasonToExcel();
      }
    )
  }

  ngOnInit() {
    var spinnerRef = this.spinnerService.start();
    this.subscription = timer(0, 60000).pipe(
      finalize(() => {
        console.log("Koniec");
        this.spinnerService.stop(spinnerRef);
      }),
      switchMap(() => this.scanningItemService.getScanningItems(this.MachineId)),
      catchError(err => of([]))).subscribe(response => {
        this.ScanningItems = response;
        this.computeRowSpans();
        this.spinnerService.stop(spinnerRef);}
        );
    this.tabSwitchSub = this.tabSwitchSource.subscribe(() => this.nextTab());
  }

  getScanningItems(): void{
    this.scanningItemService.getScanningItems(this.MachineId).subscribe(response => this.ScanningItems = response);
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
    this.tabSwitchSub.unsubscribe();
    this.exportButtonClickedSub.unsubscribe();
  }

  private computeRowSpans(): void{
    this.lastColumnName = this.displayedColumns[this.displayedColumns.length - 1];
    this.allButLastColumnNames = this.displayedColumns.slice(0, -1);
    this.rowSpans = this.rowSpanComputer.compute(this.ScanningItems, this.columnNames);
  }

  private nextTab(): void{
    if(this.selectedTab + 1 < this.tabsToSwitch.length){
      this.selectedTab++;
    }else{
      //back to start
      this.selectedTab = this.tabsToSwitch[0];
    }
  }

  tableToExcel(): void{
    /* table id is passed over here */   
    let tableId: string = "";
    if(this.selectedTab==0){
      tableId = "perf-table";
    }else{
      tableId = "shift-table";
    }
    let element = document.getElementById(tableId); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `linetracker_${Date().toString()}.xlsx`);
  }

  jasonToExcel(): void{
    /* table id is passed over here */   
    var spinnerRef = this.spinnerService.start();

    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.ScanningItems);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `linetracker_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.xlsx`);
    setTimeout(() => {
      this.spinnerService.stop(spinnerRef);
    },2500);
    
  }

  }

