import { Component, Inject, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PlannedComponent } from '../interfaces/planned-component';
import { ComponentSchedule } from '../interfaces/component-schedule';

@Component({
  selector: 'app-planned-component-schedule',
  templateUrl: './planned-component-schedule.component.html',
  styleUrls: ['./planned-component-schedule.component.scss']
})
export class PlannedComponentScheduleComponent implements OnInit {
  componentSchedule: ComponentSchedule;
  
  constructor(public dialogRef: MatDialogRef<PlannedComponentScheduleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
