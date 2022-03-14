import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { UserInteractionService } from '../services/userInteraction.service';
import { Settings } from '../settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  scopeFormControl = new FormControl('', [Validators.required, Validators.min(1)]);
  lowStockAlertFormControl = new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]);
  deliveryHourFormControl = new FormControl('', [Validators.required, Validators.min(6), Validators.max(24)]);
  lateDeliveryAlertFormControl = new FormControl('', [Validators.required, Validators.min(8)]);
  chosenScope: number;
  chosenLowStockAlert: number;
  chosenLateDeliveryAlert: number;
  chosenDeliveryHour: number;

  constructor(public settings: Settings, private userInteractionService: UserInteractionService) {
    this.chosenScope = settings.ComponentScheduleScope;
    this.chosenLowStockAlert = settings.LowStockPercentageAlert;
    this.chosenLateDeliveryAlert = settings.LateDeliveryHoursAlert;
    this.chosenDeliveryHour = settings.DeliveryHour;
   }

  ngOnInit() {
  }

  saveSettings(){
    let isValid: boolean = false;

    if(this.chosenScope > 0){
      isValid = true;
      this.settings.ComponentScheduleScope = this.chosenScope;
      localStorage.setItem("ComponentScheduleScope", this.chosenScope.toString());
    }
    if(this.chosenLowStockAlert > 0 && this.chosenLowStockAlert <= 100){
      isValid = true;
      this.settings.LowStockPercentageAlert = this.chosenLowStockAlert;
      localStorage.setItem("LowStockPercentageAlert", this.chosenLowStockAlert.toString());
    }

    if(this.chosenLateDeliveryAlert > 0){
      isValid = true;
      this.settings.LateDeliveryHoursAlert = this.chosenLateDeliveryAlert;
      localStorage.setItem("LateDeliveryHoursAlert", this.chosenLateDeliveryAlert.toString());
    }

    if([6,14,22].includes(this.chosenDeliveryHour)){
      isValid = true;
      this.settings.DeliveryHour = this.chosenDeliveryHour;
      localStorage.setItem("DeliveryHour", this.chosenDeliveryHour.toString());
    }

    if(isValid){
      console.log("Zapisuje..");
      this.userInteractionService.emitComponentsPlanSettingsChanged(true);
    }
    
  }

}
