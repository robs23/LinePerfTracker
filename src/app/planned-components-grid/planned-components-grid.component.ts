import { Component, OnInit } from '@angular/core';
import { PlannedComponent } from '../interfaces/planned-component';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-planned-components-grid',
  templateUrl: './planned-components-grid.component.html',
  styleUrls: ['./planned-components-grid.component.css']
})
export class PlannedComponentsGridComponent implements OnInit {
  PlannedComponents: PlannedComponent[];
  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute) { }

  ngOnInit() {
    let query: string = '';
    this.params.queryParams.subscribe(params => {
      query = params['query'];
    })
    if(query == undefined){
      this.getPlannedComponents();
    }else{
      this.getPlannedComponents(query);
    }
  }

  getPlannedComponents(query?: string): void{
    this.componentService.getPlannedComponents(query).subscribe(response => 
      { this.PlannedComponents = response;
      });
  }

}
