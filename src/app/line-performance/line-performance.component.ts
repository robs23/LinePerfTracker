import { Component, OnInit } from '@angular/core';
import { Settings } from '../settings';
import { Subject } from 'rxjs';
import { UserInteractionService } from '../services/userInteraction.service';

@Component({
  selector: 'app-line-performance',
  templateUrl: './line-performance.component.html',
  styleUrls: ['./line-performance.component.css']
})
export class LinePerformanceComponent {
  menuOpened = false;
  menuButton;
  

  constructor(public settings: Settings, private userInteractionService: UserInteractionService) {

  }

  toggleAutoUpdate(): void{
    if(this.settings.AutoUpdate){
      this.settings.AutoUpdate = false;
      this.userInteractionService.emitAutoUpdateClicked(false);
    }else{
        this.settings.AutoUpdate = true;
        this.userInteractionService.emitAutoUpdateClicked(true);
    }
  }

  toggleMenu(): void{
    if (this.menuOpened){
      // Close menu
      this.menuOpened = false;
    }else{
      // Open menu
      this.menuOpened = true;
    }
  }
}
