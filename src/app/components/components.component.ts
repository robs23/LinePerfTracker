import { Component, OnInit } from '@angular/core';
import { Settings } from '../settings';
import { Subject } from 'rxjs';
import { UserInteractionService } from '../services/userInteraction.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements OnInit {

  constructor(public settings: Settings, private userInteractionService: UserInteractionService) { }

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

}
