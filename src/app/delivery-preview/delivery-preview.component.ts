import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CellStyle, ColDef, GridOptions } from 'ag-grid-community';
import { Delivery } from '../interfaces/delivery';
import { localePl } from '../../assets/locale.pl.js';

@Component({
  selector: 'app-delivery-preview',
  templateUrl: './delivery-preview.component.html',
  styleUrls: ['./delivery-preview.component.scss']
})
export class DeliveryPreviewComponent implements OnInit {

  delivery: Delivery;
  colDefs: ColDef[];
  private gridOptions: GridOptions;
  constructor(public dialogRef: MatDialogRef<DeliveryPreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.delivery = this.data;
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
        headerName: "Zaznacz",
        field: "IsSelected",
        colId: "IsSelected",
        sortable: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        resizable: true,
        pinned: true,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Produkt",
        field: "ProductIndex",
        colId: "ProductIndex",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: true,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Nazwa",
        field: "ProductName",
        colId: "ProductName",
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        pinned: true,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Dostawa",
        field: "DeliveryDate",
        colId: "DeliveryDate",
        sortable: true,
        filter: "agDateColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params),
        valueFormatter: this.dateFormatter
      },
      {
        headerName: "Zamówiono",
        field: "OrderQuantity",
        colId: "OrderQuantity",
        sortable: true,
        filter: "agNumberColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Pozostało",
        field: "OpenQuantity",
        colId: "OpenQuantity",
        sortable: true,
        filter: "agNumberColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params)
      },
      {
        headerName: "Utworzono",
        field: "DocumentDate",
        colId: "DocumentDate",
        sortable: true,
        filter: "agDateColumnFilter",
        resizable: true,
        pinned: false,
        cellStyle: params => this.cellStyle(params),
        valueFormatter: this.dateFormatter
      }
    ]

    return res;

  }

  cellStyle(params): CellStyle{
    try{
      let component = params.data.ProductIndex;
      let date = params.data.DeliveryDate;
      if(component == this.delivery.SelectdItem.ProductIndex && date == this.delivery.SelectdItem.DeliveryDate){
        return { backgroundColor: '#cddc39', color: 'black'};
      }
    }catch(error){
      console.log(error);
    }
    return { color: 'black'};
  }

  dateFormatter(params): string{
    let dateString = params.data.DocumentDate;
    if(params.column.colId == "DeliveryDate"){
      dateString = params.data.DeliveryDate;
    }
    let date = new Date(dateString);
    return date.formatString();
  }


}
