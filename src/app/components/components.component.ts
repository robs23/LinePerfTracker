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

  constructor(private userInteractionService: UserInteractionService) { }

  ngOnInit() {
  }

  exportToExcel(): void{
    this.userInteractionService.emitExportClicked(true);
  }

}
