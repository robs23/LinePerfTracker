import { Component, OnInit } from '@angular/core';
import { ProductionPlanService } from '../services/production-plan.service';
import { ProductionPlanTransformer } from '../production-plan-transformer';
import { ProductionPlanItem } from '../interfaces/production-plan-item';
import { Location } from '../interfaces/location';
import { RowSpanComputer, Span } from '../row-span-computer';

@Component({
  selector: 'app-production-plan-by-country',
  templateUrl: './production-plan-by-country.component.html',
  styleUrls: ['./production-plan-by-country.component.css']
})
export class ProductionPlanByCountryComponent implements OnInit {
  Locations: Location[];
  PlanItems: ProductionPlanItem[];
  rowSpans: Array<Span[]>;
  
  private planTransformer = new ProductionPlanTransformer();
  private rowSpanComputer = new RowSpanComputer();
  displayedColumns: string[] = ['LOCATION', 'WEEK','YEAR','START_DATE','STOP_DATE','MACHINE_NAME','ORDER_NR','PRODUCT_NR','NAME','QUANTITY','PAL'];

  constructor(private planService: ProductionPlanService) { }

  ngOnInit() {
    this.getPlanByLocations();
  }

  getPlanByLocations(query?: string): void{
    this.planService.getProductionPlanByLocation(query).subscribe(response => 
      { this.Locations = response;
        this.PlanItems = this.planTransformer.dropLocation(this.Locations);
        this.rowSpans = this.rowSpanComputer.compute(this.PlanItems, this.displayedColumns);
      });
  }

}
