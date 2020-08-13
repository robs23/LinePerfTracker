import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Machine } from '../machine';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {
  machine: Machine;
  id: number;
  name: string;
  state: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
  }

}
