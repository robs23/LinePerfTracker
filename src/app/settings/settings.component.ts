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
  chosenScope: number;
  chosenLowStockAlert: number;

  constructor(public settings: Settings, private userInteractionService: UserInteractionService) {
    this.chosenScope = settings.ComponentScheduleScope;
    this.chosenLowStockAlert = settings.LowStockPercentageAlert;
   }

  ngOnInit() {
  }

  saveSettings(){
    let isValid: boolean = false;

    if(this.chosenScope > 0){
      isValid = true;
      this.settings.ComponentScheduleScope = this.chosenScope;
      
    }
    if(this.chosenLowStockAlert > 0 && this.chosenLowStockAlert <= 100){
      isValid = true;
      this.settings.LowStockPercentageAlert = this.chosenLowStockAlert;
    }

    if(isValid){
      console.log("Zapisuje..");
      this.userInteractionService.emitComponentsPlanSettingsChanged(true);
    }
    
  }

}
