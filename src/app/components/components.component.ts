import { Component, OnInit } from '@angular/core';
import { Settings } from '../settings';
import { Subject } from 'rxjs';
import { UserInteractionService } from '../services/userInteraction.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements OnInit {

  settingsPageRef;

  constructor(public settings: Settings, private userInteractionService: UserInteractionService, private settingsService: SettingsService) { }

  ngOnInit() {
  }

  exportToExcel(): void{
    this.userInteractionService.emitExportClicked(true);
  }

  toggleDeliveriesCoverage(): void{
    if(this.settings.PlanCoverageByDeliveries){
      this.settings.PlanCoverageByDeliveries = false;
      this.userInteractionService.emitPlanCoverageByDeliveriesClicked(false);
    }else{
        this.settings.PlanCoverageByDeliveries = true;
        this.userInteractionService.emitPlanCoverageByDeliveriesClicked(true);
    }
  }

  openSettingsPage(): void{
    this.settingsPageRef = this.settingsService.openSettingsPage();
  }

}
