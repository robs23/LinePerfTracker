import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Settings {
  AutoUpdate: boolean = true;
  TabSwitch: boolean = true;
  PlanCoverageByDeliveries: boolean = false;
  ComponentScheduleScope: number = localStorage.getItem("ComponentScheduleScope") ? Number(localStorage.getItem("ComponentScheduleScope")) : 10; //how many days forward the schedule should show?
  LowStockPercentageAlert: number = localStorage.getItem("LowStockPercentageAlert") ? Number(localStorage.getItem("LowStockPercentageAlert")) : 20; //stock at the end of shift / beginning stock. If lower than this parameter, alert
  LateDeliveryHoursAlert: number = localStorage.getItem("LateDeliveryHoursAlert") ? Number(localStorage.getItem("LateDeliveryHoursAlert")) : 24; //delivery must be 8 hours before coverage ends, otherwise alert
  DeliveryHour: number = localStorage.getItem("DeliveryHour") ? Number(localStorage.getItem("DeliveryHour")) : 14; //assumes deliveries on 2nd shift (14:00 - 22:00)
}