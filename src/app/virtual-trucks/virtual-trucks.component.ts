import { Component, Input, OnInit } from '@angular/core';
import { VirtualTruck} from '../interfaces/virtual-truck'
import { VirtualTruckService} from '../services/virtual-truck.service';

@Component({
  selector: 'app-virtual-trucks',
  templateUrl: './virtual-trucks.component.html',
  styleUrls: ['./virtual-trucks.component.css']
})
export class VirtualTrucksComponent implements OnInit {
  selectedTab: number = 0;
  Trucks: VirtualTruck[];

  constructor(private vtService: VirtualTruckService) { }

  ngOnInit() {
    this.getTrucks();
  }

  getTrucks(query?: string): void{
    this.vtService.getVirtualTrucks(query).subscribe(response => this.Trucks = response);
  }

  onTabChanged(arg){
    let currentTabIndex = arg.index;
    this.selectedTab = currentTabIndex;
  }

}
