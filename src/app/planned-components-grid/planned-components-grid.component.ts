import { Component, OnInit } from '@angular/core';
import { PlannedComponent } from '../interfaces/planned-component';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-planned-components-grid',
  templateUrl: './planned-components-grid.component.html',
  styleUrls: ['./planned-components-grid.component.css']
})
export class PlannedComponentsGridComponent implements OnInit {
  PlannedComponents: PlannedComponent[];
  colDefs: ColDef[];
  gridOptions: GridOptions;

  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute) {
    
    this.gridOptions = <GridOptions>{};
    // this.gridOptions = {
    //   onGridReady: () => {
    //     this.gridOptions.api.setRowData(this.PlannedComponents);
    //   },
    //   onGridSizeChanged: () => {
    //     this.gridOptions.api.sizeColumnsToFit();
    //   }
    // };
    // this.gridOptions.columnDefs = this.colDefs;
   }

  ngOnInit() {
    this.setHeaders();
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
        this.gridOptions.api.setRowData(this.PlannedComponents);
        this.gridOptions.columnDefs = this.colDefs;
      });
  }

  setHeaders(){
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

  

}
