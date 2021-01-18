import { Component, OnInit } from '@angular/core';
import { DividerItem } from '../interfaces/divider-item';
import { DividerService } from '../services/divider.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.css']
})
export class DividerComponent implements OnInit {
  divider: DividerItem[];
  unicorns: string[] = Array(); // Unique L-plants
  week: number;
  year: number;
  columnNames: string[] = ['ZfinIndex', 'Locations'];
  constructor(private dividerService: DividerService, private params: ActivatedRoute) { }

  ngOnInit(): void {
    let sWeek: string = this.params.snapshot.paramMap.get('week');
    let sYear: string = this.params.snapshot.paramMap.get('year');
    if(isNaN(Number(sWeek)) || sWeek == null){
      this.week = 1;
    }else{
      this.week = Number(sWeek);
    }
    if(isNaN(Number(sYear)) || sYear == null){
      this.year = 2021;
    }else{
      this.year = Number(sYear);
    }
    this.getDivider(this.week, this.year);
    
  }

  getDivider(week: number, year: number): void{
    this.dividerService.getDivider(week, year).subscribe(response => {
      this.divider = response;
      this.getUniqueLplants(this.divider);
      });
    
  }

  getUniqueLplants(div: DividerItem[]){
    for(var d of div){
      for(var l of d.Locations){
        if(this.unicorns.filter(x=>x==l.L).length == 0){
          //L is unique
          this.unicorns.push(l.L);
        }
      }
    }
    this.unicorns.sort();
  }

}
