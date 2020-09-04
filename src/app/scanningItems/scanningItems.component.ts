import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, of, timer, Subscription } from 'rxjs';
import { ScanningItemService } from '../services/scanningItem.service';
import { ScanningItem } from '../scanningItem';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { MachineComponent } from '../machine/machine.component';
import { UserInteractionService } from '../services/userInteraction.service';

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
      catchError(err => of([]))).subscribe(response => this.ScanningItems = response);
  }

  getScanningItems(): void{
    this.scanningItemService.getScanningItems(this.MachineId).subscribe(response => this.ScanningItems = response);
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  }

