import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-planned-components-range',
  templateUrl: './planned-components-range.component.html',
  styleUrls: ['./planned-components-range.component.css']
})
export class PlannedComponentsRangeComponent implements OnInit {

  scopeFormControl = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor() { }

  ngOnInit() {
  }

}
