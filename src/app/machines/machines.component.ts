import { Component, OnInit } from '@angular/core';
import { Machine } from '../machine';
import { MACHINES } from '../mock-machines';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  machines = MACHINES;
  
  constructor() { }

  ngOnInit() {
  }

}
