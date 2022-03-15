import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {

  AutoUpdateClickedSubject: Subject<boolean> = new Subject<boolean>();
  TabSwitchClickedSubject: Subject<boolean> = new Subject<boolean>();
  ExportClickedSubject: Subject<boolean> = new Subject<boolean>();
  PlanCoverageByDeliveriesClickedSubject: Subject<boolean> = new Subject<boolean>();
  ComponentsPlanSettingsChangedSubject: Subject<boolean> = new Subject<boolean>();
  ComponentsPlanQuickFilterChangedSubject: Subject<string> = new Subject<string>();

  autoUpdateClicked$ = this.AutoUpdateClickedSubject.asObservable();
  tabSwitchClicked$ = this.TabSwitchClickedSubject.asObservable();
  exportClicked$ = this.ExportClickedSubject.asObservable();
  coverageByDeliveriesClicked$ = this.PlanCoverageByDeliveriesClickedSubject.asObservable();
  componentsPlanSettingsChanged$ = this.ComponentsPlanSettingsChangedSubject.asObservable();
  componentsPlanQuickFilterChanged$ = this.ComponentsPlanQuickFilterChangedSubject.asObservable();

  emitAutoUpdateClicked(value: boolean){
    this.AutoUpdateClickedSubject.next(value);
  }

  emitTabSwitchClicked(value: boolean){
    this.TabSwitchClickedSubject.next(value);
  }

  emitExportClicked(value: boolean){
    this.ExportClickedSubject.next(value);
  }

  emitPlanCoverageByDeliveriesClicked(value: boolean){
    this.PlanCoverageByDeliveriesClickedSubject.next(value);
  }

  emitComponentsPlanSettingsChanged(value: boolean){
    this.ComponentsPlanSettingsChangedSubject.next(value);
  }

  emitComponentsPlanQuickFilterChanged(value: string){
    this.ComponentsPlanQuickFilterChangedSubject.next(value);
  }

}
