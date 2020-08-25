import { Component, OnInit } from '@angular/core';
import { Machine } from '../machine';
import { MACHINES } from '../mock-machines';
import { MachineService } from '../services/machine.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  machines: Machine[];
  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
    this.getMachines();
  }

  getMachines(): void{
    this.machineService.getMachines().subscribe(response => this.machines = response);
  }

}
