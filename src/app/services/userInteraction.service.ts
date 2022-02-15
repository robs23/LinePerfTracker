import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {

  AutoUpdateClickedSubject: Subject<boolean> = new Subject<boolean>();
  TabSwitchClickedSubject: Subject<boolean> = new Subject<boolean>();
  ExportClickedSubject: Subject<boolean> = new Subject<boolean>();
  PlanCoverageByInventoryClickedSubject: Subject<boolean> = new Subject<boolean>();
  PlanCoverageByDeliveriesClickedSubject: Subject<boolean> = new Subject<boolean>();

  autoUpdateClicked$ = this.AutoUpdateClickedSubject.asObservable();
  tabSwitchClicked$ = this.TabSwitchClickedSubject.asObservable();
  exportClicked$ = this.ExportClickedSubject.asObservable();
  coverageByInventoryClicked$ = this.PlanCoverageByInventoryClickedSubject.asObservable();
  coverageByDeliveriesClicked$ = this.PlanCoverageByDeliveriesClickedSubject.asObservable();

  emitAutoUpdateClicked(value: boolean){
    this.AutoUpdateClickedSubject.next(value);
  }

  emitTabSwitchClicked(value: boolean){
    this.TabSwitchClickedSubject.next(value);
  }

  emitExportClicked(value: boolean){
    this.ExportClickedSubject.next(value);
  }

  emitPlanCoverageByInventoryClicked(value: boolean){
    this.PlanCoverageByInventoryClickedSubject.next(value);
  }

  emitPlanCoverageByDeliveriesClicked(value: boolean){
    this.PlanCoverageByDeliveriesClickedSubject.next(value);
  }

}
