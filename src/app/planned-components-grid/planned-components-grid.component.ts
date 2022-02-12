import { Component, OnInit } from '@angular/core';
import { PlannedComponent } from '../interfaces/planned-component';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { count, first } from 'rxjs/operators';
import { localePl } from '../../assets/locale.pl.js';
import { InventorySnapshot } from '../interfaces/inventory-snapshot';
import { DeliveryItem } from '../interfaces/delivery-item';
import { FunctionsService } from '../services/functions.service';
import * as extensions from '../extensions';

@Component({
  selector: 'app-planned-components-grid',
  templateUrl: './planned-components-grid.component.html',
  styleUrls: ['./planned-components-grid.component.css']
})
export class PlannedComponentsGridComponent implements OnInit {
  PlannedComponents: PlannedComponent[];
  InventorySnapshots: InventorySnapshot[];
  DeliveryItems: DeliveryItem[];
  colDefs: ColDef[];
  private gridOptions: GridOptions;

  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute) {

   }

  ngOnInit() {
    this.setGridOptions()
    this.setHeaders();
    let query: string = '';
    this.params.queryParams.subscribe(params => {
      query = params['query'];
    })
    if(query == undefined){
      this.getInventorySnapshots();
    }else{
      this.getInventorySnapshots(query);
    }
  }

  onGridReady(params){
    this.gridOptions.columnApi.autoSizeAllColumns(true);
  }

  setGridOptions(){
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) =>  localePl[key] || defaultValue,
      enableCellTextSelection: true,
      rowSelection: 'multiple'
    }
  }


  getPlannedComponents(query?: string): void{
    //this.gridOptions.api.showLoadingOverlay();
    this.componentService.getPlannedComponents(query).subscribe(response => 
      { 
        this.PlannedComponents = response;
      });
  }

  getInventorySnapshots(query?: string): void{
    this.componentService.getInventorySnapshots(query).subscribe(response => 
      {
        this.InventorySnapshots = response;
        let firstDateString: string;
        let lastDateString: string;

        if(this.InventorySnapshots.length > 0){
          firstDateString = this.InventorySnapshots[0].TakenOn;
        }else{
          const now = new Date(Date.now());
          firstDateString = now.toISOString();
        }
        var firstDate = new Date(firstDateString);
        firstDateString = firstDate.formatString();
        var lastDate = firstDate.addDays(7);
        lastDateString = lastDate.formatString();
        const qry = `OPERATION_DATE >= '${firstDateString}' AND OPERATION_DATE < '${lastDateString}'`;
        this.getPlannedComponents(qry);
      })
  }



  setHeaders(){
    this.colDefs = [
      { 
        headerName: 'Czas',
        field: 'OPERATION_DATE',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Data',
        field: 'OPERATION_DAY',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Tydzień',
        field: 'OPERATION_WEEK',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Rok',
        field: 'OPERATION_YEAR',
        sortable: true,
        filter: true,
        resizable: true
      },
      { 
        headerName: 'Nr zmiany',
        field: 'SHIFT_ID',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Zmiana',
        field: 'SHIFT_NAME',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Maszyna',
        field: 'MACHINE_NR',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Operacja',
        field: 'OPERATION_NR',
        sortable: true,
        filter: true,
        resizable: true
      },
      { 
        headerName: 'Obszar',
        field: 'OPERATION_TYPE_NAME',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Zlecenie',
        field: 'ORDER_NR',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Index',
        field: 'PRODUCT_NR',
        sortable: true,
        filter: true,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Nazwa',
        field: 'PRODUCT_NAME',
        sortable: true,
        filter: true,
        pinned: 'left',
        resizable: true
      },
      { 
        headerName: 'Grupa',
        field: 'PROD_TYPE',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Typ',
        field: 'SUB_PROD_TYPE',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Kod',
        field: 'ORDER_TYPE_CODE',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Kod2',
        field: 'ORDER_TYPE_NAME',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'BOM',
        field: 'BOM_NR',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Ilość [szt.]',
        field: 'PRODUCT_QUANTITY',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Ilość w operacji [szt.]',
        field: 'PRODUCT_QUANTITY_ALL',
        sortable: true,
        filter: true,
        resizable: true
      }
    ]
  }

  

}
