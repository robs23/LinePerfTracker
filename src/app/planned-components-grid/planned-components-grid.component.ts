import { Component, OnInit } from '@angular/core';
import { PlannedComponent } from '../interfaces/planned-component';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planned-components-grid',
  templateUrl: './planned-components-grid.component.html',
  styleUrls: ['./planned-components-grid.component.css']
})
export class PlannedComponentsGridComponent implements OnInit {
  PlannedComponents: Observable<any[]>;
  colDefs: ColDef[];

  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute) {
    this.colDefs = [
      { 
        headerName: 'Czas',
        field: 'OPERATION_DATE'
      },
      {
        headerName: 'Data',
        field: 'OPERATION_DAY'
      },
      {
        headerName: 'Tydzień',
        field: 'OPERATION_WEEK'
      },
      {
        headerName: 'Rok',
        field: 'OPERATION_YEAR'
      },
      { 
        headerName: 'Nr zmiany',
        field: 'SHIFT_ID'
      },
      {
        headerName: 'Zmiana',
        field: 'SHIFT_NAME'
      },
      {
        headerName: 'Maszyna',
        field: 'MACHINE_NR'
      },
      {
        headerName: 'Operacja',
        field: 'OPERATION_NR'
      },
      { 
        headerName: 'Obszar',
        field: 'OPERATION_TYPE_NAME'
      },
      {
        headerName: 'Zlecenie',
        field: 'ORDER_NR'
      },
      {
        headerName: 'Index',
        field: 'PRODUCT_NR'
      },
      {
        headerName: 'Nazwa',
        field: 'PRODUCT_NAME'
      },
      { 
        headerName: 'Grupa',
        field: 'PROD_TYPE'
      },
      {
        headerName: 'Typ',
        field: 'SUB_PROD_TYPE'
      },
      {
        headerName: 'Kod',
        field: 'ORDER_TYPE_CODE'
      },
      {
        headerName: 'Kod2',
        field: 'ORDER_TYPE_NAME'
      },
      {
        headerName: 'BOM',
        field: 'BOM_NR'
      },
      {
        headerName: 'Ilość [szt.]',
        field: 'PRODUCT_QUANTITY'
      },
      {
        headerName: 'Ilość w operacji [szt.]',
        field: 'PRODUCT_QUANTITY_ALL'
      }
    ]
   }

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
      { 
        this.PlannedComponents = response;
      });
  }

}
