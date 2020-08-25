import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Machine } from '../machine';
import { MachineService } from '../services/machine.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {
  public machine: Machine = null;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private machineService: MachineService
  ){}

  ngOnInit(): void {
    this.getMachine();
  }

  getMachine(): void{
    const id = +this.route.snapshot.paramMap.get('id');
    this.machineService.getMachine(id).subscribe(mach => this.machine = mach);
  }

}
