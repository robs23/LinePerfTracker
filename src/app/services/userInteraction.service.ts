import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {

  AutoUpdateClickedSubject: Subject<boolean> = new Subject<boolean>();
  TabSwitchClickedSubject: Subject<boolean> = new Subject<boolean>();

  autoUpdateClicked$ = this.AutoUpdateClickedSubject.asObservable();
  tabSwitchClicked$ = this.TabSwitchClickedSubject.asObservable();

  emitAutoUpdateClicked(value: boolean){
    this.AutoUpdateClickedSubject.next(value);
  }

  emitTabSwitchClicked(value: boolean){
    this.TabSwitchClickedSubject.next(value);
  }

}
