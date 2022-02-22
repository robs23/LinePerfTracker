import { Component, Inject, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PlannedComponent } from '../interfaces/planned-component';
import { ComponentSchedule } from '../interfaces/component-schedule';
import { CellStyle, CellStyleFunc, ColDef, GridOptions } from 'ag-grid-community';
import { localePl } from '../../assets/locale.pl.js';

@Component({
  selector: 'app-planned-component-schedule',
  templateUrl: './planned-component-schedule.component.html',
  styleUrls: ['./planned-component-schedule.component.scss']
})
export class PlannedComponentScheduleComponent implements OnInit {
  componentSchedule: ComponentSchedule;
  colDefs: ColDef[];
  private gridOptions: GridOptions;
  
  constructor(public dialogRef: MatDialogRef<PlannedComponentScheduleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.componentSchedule = this.data;
    this.setGridOptions();
    this.colDefs = this.getColumnDefs();
    
  }

  setGridOptions(){
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) =>  localePl[key] || defaultValue,
      enableCellTextSelection: true,
      rowSelection: 'multiple'
    }
  }

  onGridReady(params){
    this.gridOptions.columnApi.autoSizeAllColumns(true);
  }

  getColumnDefs(): ColDef[]{
    let res: ColDef[] = [
      {
        headerName: "Data",
        field: "OPERATION_DATE",
        colId: "Date",
        sortable: true,
        filter: "agDateColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params),
        valueFormatter: this.dateFormatter
      },
      {
        headerName: "Maszyna",
        field: "MACHINE_NR",
        colId: "Machine",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Zlecenie",
        field: "ORDER_NR",
        colId: "Order",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Operacja",
        field: "OPERATION_NR",
        colId: "Operation",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "ZFIN ZFOR",
        field: "PARENT_NR",
        colId: "Parent",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Ilość",
        field: "PRODUCT_QUANTITY",
        colId: "ProductQty",
        sortable: true,
        filter: "agNumberColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
    ]

    return res;

  }

  cellStyle(params): CellStyle{
    try{
      let currDate: Date;
      currDate = new Date(params.data.OPERATION_DATE);
      if(currDate >= this.componentSchedule.SELECTED_PERIOD_START && currDate < this.componentSchedule.SELECTED_PERIOD_END){
        return {backgroundColor: '#cddc39',color: 'black'};
      }
    }catch(error){
      console.log(error);
    }
    return { color: 'black'};
  }

  dateFormatter(params): string{
    let dateString = params.data.OPERATION_DATE;
    let date = new Date(dateString);
    return date.formatString();
  }

}
