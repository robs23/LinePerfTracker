import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CellStyle, CellStyleFunc, ColDef, GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
import { UserInteractionService } from '../services/userInteraction.service';
import { forkJoin } from 'rxjs';
import { count, first } from 'rxjs/operators';
import { localePl } from '../../assets/locale.pl.js';
import { InventorySnapshot } from '../interfaces/inventory-snapshot';
import { DeliveryItem } from '../interfaces/delivery-item';
import { FunctionsService } from '../services/functions.service';
import { SpinnerService  } from '../services/spinner.service';
import '../extensions';
import * as XLSX from 'xlsx'; 
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { formatCurrency } from '@angular/common';
import { ComponentSchedule } from '../interfaces/component-schedule';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-planned-components-grid',
  templateUrl: './planned-components-grid.component.html',
  styleUrls: ['./planned-components-grid.component.css']
})
export class PlannedComponentsGridComponent implements OnInit, OnDestroy {
  InventorySnapshots: InventorySnapshot[];
  DeliveryItems: DeliveryItem[];
  PlannedComponentsSchedule: any[];
  colDefs: ColDef[];
  exportButtonClickedSub: Subscription;
  deliveriesCoverageClickedSub: Subscription;
  private gridOptions: GridOptions;
  firstPlanDate: Date = new Date(2100, 0,1);
  componentPageRef;

  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute, private spinnerService: SpinnerService, private userInteractionService: UserInteractionService) {
    this.exportButtonClickedSub = userInteractionService.exportClicked$.subscribe(
      value => {
        //this.exportToExcel();
        this.jasonToExcel();
      }
    );
    this.deliveriesCoverageClickedSub = userInteractionService.coverageByDeliveriesClicked$.subscribe(
      value => {
        if(value){
          // on
          this.logData();
        }else{
          //off
        }
      }
    );
   }

  ngOnInit() {
    this.setGridOptions()
    //this.setHeaders();
    let query: string = '';
    this.params.queryParams.subscribe(params => {
      query = params['query'];
    })
    if(query == undefined){
      this.getData();
    }else{
      this.getData(query);
    }
  }

  ngOnDestroy(): void{
    this.exportButtonClickedSub.unsubscribe();
    this.deliveriesCoverageClickedSub.unsubscribe();
  }

  onGridReady(params){
    //this.gridOptions.columnApi.autoSizeAllColumns(true);
  }

  setGridOptions(){
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) =>  localePl[key] || defaultValue,
      enableCellTextSelection: true,
      rowSelection: 'multiple'
    }
  }

  getData(query?: string): void{
    this.componentService.getInventorySnapshots(query).subscribe(response => 
      {
        var spinnerRef = this.spinnerService.start();
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
        var today = new Date();
        var lastDate = today.addDays(7);
        firstDateString = firstDate.formatString();
        lastDateString = lastDate.formatString();
        const qry = `OPERATION_DATE >= '${firstDateString}' AND OPERATION_DATE < '${lastDateString}' AND SUB_PROD_TYPE <> 'Półprodukty'`;
        this.componentService.getComponentsScheduleAndDeliveries(qry).subscribe(responseList => {
          this.PlannedComponentsSchedule = responseList[0];
          this.DeliveryItems = responseList[1];
          this.setFirstPlanDate();
          this.addInventoryAndCoverageEndColumns();
          this.setDynamicHeaders();
          this.spinnerService.stop(spinnerRef);
        });
      })
  }

  addInventoryAndCoverageEndColumns(): void{
    let newArray = [];
    for(let i = 0; i < this.PlannedComponentsSchedule.length; i++){
      let ind = this.PlannedComponentsSchedule[i].Produkt;
      let stock = this.InventorySnapshots.find(f=>f.ProductIndex == ind && f.Status == "U")?.Size;

      if(stock == undefined){
        stock = 0;
      }
      let element = this.PlannedComponentsSchedule[i].Zapas = stock;

      let currDate = this.calculateCoverageEnd(this.PlannedComponentsSchedule[i]);
      this.PlannedComponentsSchedule[i].Pokrycie = currDate;

    }
  }

  setFirstPlanDate(): void{
    var p = this.PlannedComponentsSchedule[0];
    for(var key in p){
      if(p.hasOwnProperty(key)){
        if(key.includes("__")){
          let day = key.substring(8,10);
          let month = key.substring(5,7);
          let year = key.substring(0,4);
          let shift = key.substring(key.length-1,key.length);
          let hour = 0;
          switch(shift){
            case '1':
              hour = 6;
              break;
            case '2':
              hour = 14;
              break;
            case '3':
              hour = 22;
              break;
          }
          let currDate = new Date(Number(year), Number(month)-1, Number(day), hour, 0, 0);
          if(currDate < this.firstPlanDate){
            this.firstPlanDate = currDate;
          }
        }
      }
    }
  }

  calculateCoverageEnd(item): Date{
    let stock = item.Zapas;
    let endDate = this.firstPlanDate;

    for(let key in item){
      if(key.includes("__")){
        let plan = item[key];
        stock = stock - plan;
        let day = key.substring(8,10);
        let month = key.substring(5,7);
        let year = key.substring(0,4);
        let shift = key.substring(key.length-1,key.length);
        let hour = 0;
        switch(shift){
          case '1':
            hour = 6;
            break;
          case '2':
            hour = 14;
            break;
          case '3':
            hour = 22;
            break;
        }
        
        if(stock < 0){
          //our coverage ends here
          break;
        }
        endDate = new Date(Number(year), Number(month)-1, Number(day), hour, 0, 0);
      }
    }
    return endDate;
  }

  getDelivery(index: string, day: string): number{
    let res = 0;
    let currDate: Date;

    //let x = this.DeliveryItems.find(f=>f.ProductIndex==index && f.DeliveryDate==currDate)
    return res;
  }


  setDynamicHeaders(): void{
    var p = this.PlannedComponentsSchedule[0];
    this.colDefs = [];

    for (var key in p) {
      if (p.hasOwnProperty(key)) {
        let hName = key;
        let isPinned = true;
        let colWidth = 90;
        let colFilter = "agTextColumnFilter";
        let colType = "textColumn";
        let colFormatter = null;

        if(key == "Nazwa"){
          colWidth = 180;
        }else if(key == "Typ"){
          colWidth = 140;
        }else if(key == "Zapas"){
          colFilter = "agNumberColumnFilter";
          colType = "numberColumn";
        }else if(key == "Pokrycie"){
          colFilter = "agDateColumnFilter";
          colType = "dateColumn";
          colFormatter = this.dateFormatter;
        }

        if(key.includes("__")){
          colType = "numberColumn";
          let day = key.substring(8,10);
          let month = key.substring(5,7);
          let shift = key.substring(key.length-1,key.length);

          switch(shift){
            case '1':
              shift = "I";
              break;
            case '2':
              shift = "II";
              break;
            case '3':
              shift = "III";
              break;
          }

          isPinned = false;
          hName = `${day}.${month} ${shift}`;
          colFilter = "agNumberColumnFilter";
        }

          this.colDefs.push({
            headerName: hName,
            field: key,
            colId: key,
            sortable: true,
            filter: colFilter,
            resizable: true,
            pinned: isPinned,
            cellStyle: params => this.cellStyle(params, key),
            width: colWidth,
            type: colType,
            valueFormatter: colFormatter
          })
      }
    }
  }

  logData(): void{
    this.gridOptions.api.forEachNode(function(node){
      console.log("Values: ", node);
    });
  }

  dateFormatter(params): string{
    let dateString = params.data.Pokrycie;
    let date = new Date(dateString);
    return date.formatString();
  }

  cellStyle(params, id: string): CellStyle{
    var endDate = params.node.data.Pokrycie;
    let key = params.column.colId;

    if(key.includes("__")){
      let day = key.substring(8,10);
      let month = key.substring(5,7);
      let year = key.substring(0,4);
      let shift = key.substring(key.length-1,key.length);
      let hour = 0;
      
      switch(shift){
        case '1':
          hour = 6;
          break;
        case '2':
          hour = 14;
          break;
        case '3':
          hour = 22;
          break;
      }
      let currDate = new Date(Number(year), Number(month)-1, Number(day), hour, 0, 0);
      let today = new Date();
      let currShift = today.getShift();
      if(Number(day) == today.getDate() && Number(month) == (today.getMonth()+1) && shift == currShift.toString()){
        if(currDate < endDate){
          return {backgroundColor: '#c99c8d', borderColor: 'transparent #cddc39', borderWidth: '1px 5px' ,color: 'black'};
        }else{
          return {borderColor: 'transparent #cddc39', borderWidth: '1px 5px',color: 'black'};
        }
      }
      if(currDate <= endDate){
        return {backgroundColor: '#c99c8d', color: 'black'};
      }
    }
    return {color: 'black'};
  }

  jasonToExcel(): void{
    /* table id is passed over here */   
    var spinnerRef = this.spinnerService.start();
    let ws: XLSX.WorkSheet;
      ws =XLSX.utils.json_to_sheet(this.PlannedComponentsSchedule);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `plan_komponentów_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.xlsx`);
    setTimeout(() => {
      this.spinnerService.stop(spinnerRef);
    },2500);
    
  }  

  onCellDoubleClicked(params){
    let component = params.data.Produkt;
    let period = params.column.colId;
  }

  showComponentPage(e, chart, opts): void{
    let query: string;
    let currComponent: ComponentSchedule;
    this.componentService.getPlannedComponents(query).subscribe(response => {
      currComponent.SCHEDULE = response;
    });
    this.componentPageRef = this.componentService.openComponentSchedulePage(currComponent);
  }

}
