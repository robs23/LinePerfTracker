import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Settings {
  AutoUpdate: boolean = true;
  TabSwitch: boolean = true;
  PlanCoverageByDeliveries: boolean = false;
  ComponentScheduleScope: number = 7; //how many days forward the schedule should show?
  LowStockPercentageAlert: number = 20; //stock at the end of shift / beginning stock. If lower than this parameter, alert
  LateDeliveryHoursAlert: number = 8; //delivery must be 8 hours before coverage ends, otherwise alert
}