import { Component, OnInit } from '@angular/core';
import { Settings } from '../settings';

@Component({
  selector: 'app-line-performance',
  templateUrl: './line-performance.component.html',
  styleUrls: ['./line-performance.component.css']
})
export class LinePerformanceComponent {
  menuOpened = false;
  menuButton;

  constructor(public settings: Settings) {

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
