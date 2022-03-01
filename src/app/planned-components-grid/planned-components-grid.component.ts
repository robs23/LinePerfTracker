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
import { Settings } from '../settings';
import * as XLSX from 'xlsx'; 
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { formatCurrency } from '@angular/common';
import { ComponentSchedule } from '../interfaces/component-schedule';
import { stringify } from '@angular/compiler/src/util';
import { PlannedComponent } from '../interfaces/planned-component';

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
  realTimeStockCategories: string[] = ["Surowce"];

  constructor(public settings: Settings, private componentService: PlannedComponentsService, private params: ActivatedRoute, private spinnerService: SpinnerService, private userInteractionService: UserInteractionService) {
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
          this.addDeliveriesCoverageColumn();
          this.recalculateAlert();
          this.gridOptions.api.setColumnDefs(this.colDefs);
        }else{
          //off
          this.remvoeDeliveriesCoverageColumn();
          this.recalculateAlert();
          this.gridOptions.api.setColumnDefs(this.colDefs);
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
          this.removeCoveredProduction()
          this.setFirstPlanDate();
          this.addInventoryAndCoverageEndColumns();
          this.setDynamicHeaders();
          this.recalculateAlert();
          this.spinnerService.stop(spinnerRef);
        });
      })
  }

  addInventoryAndCoverageEndColumns(): void{
    for(let i = 0; i < this.PlannedComponentsSchedule.length; i++){
      let ind = this.PlannedComponentsSchedule[i].Produkt;
      let stock = this.InventorySnapshots.find(f=>f.ProductIndex == ind && f.Status == "U")?.Size;

      if(stock == undefined){
        stock = 0;
      }
      this.PlannedComponentsSchedule[i].Zapas = stock;

      let currDate = this.calculateCoverageEnd(this.PlannedComponentsSchedule[i], false);
      this.PlannedComponentsSchedule[i].Pokrycie = currDate;

    }
  }

  addDeliveriesCoverageColumn(): void{
    for(let i = 0; i < this.PlannedComponentsSchedule.length; i++){
      let currDate = this.calculateCoverageEnd(this.PlannedComponentsSchedule[i], true);
      this.PlannedComponentsSchedule[i].Pokrycie_dostawami = currDate;
    }
    this.colDefs.push({
      headerName: "Pokrycie dostawami",
      field: "Pokrycie_dostawami",
      colId: "Pokrycie_dostawami",
      sortable: true,
      filter: "agDateColumnFilter",
      resizable: true,
      pinned: true,
      cellStyle: params => this.cellStyle(params),
      width: 90,
      type: "dateColumn",
      valueFormatter: this.dateFormatter
    });
  }

  remvoeDeliveriesCoverageColumn(): void{
    let col = this.colDefs.find(f=>f.field=="Pokrycie_dostawami");
    const ind = this.colDefs.indexOf(col);
    if(ind > -1){
      this.colDefs.splice(ind,1);
    }
  }

  recalculateAlert(): void{
    let currDate = new Date().addDays(30);
    for(let i = 0; i < this.PlannedComponentsSchedule.length; i++){
      if(this.settings.PlanCoverageByDeliveries){
        currDate = new Date(this.PlannedComponentsSchedule[i].Pokrycie_dostawami);
      }else{
        currDate = new Date(this.PlannedComponentsSchedule[i].Pokrycie);
      }
      if(currDate < this.firstPlanDate.addHours(128)){ //5 days + 8h
        this.PlannedComponentsSchedule[i].Alert = "Alert";
      }else{
        this.PlannedComponentsSchedule[i].Alert = "";
      }
    }
    let alertCol = this.colDefs.find(f=>f.colId=="Alert");
    if(alertCol != undefined){
      let ind = this.colDefs.indexOf(alertCol);
      if(ind > -1){
        this.colDefs.splice(ind, 1);
      }
    }

    this.colDefs.push({
      headerName: "Alert",
      field: "Alert",
      colId: "Alert",
      sortable: true,
      filter: "agTextColumnFilter",
      resizable: true,
      pinned: true,
      cellStyle: params => this.cellStyle(params),
      width: 50,
      type: "textColumn",
    });
    
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

  calculateCoverageEnd(item, withDeliveries: boolean): Date{
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
        if(withDeliveries){
          let component: string = item["Produkt"];
          let currDate = this.colIdToDate(key);
          if(currDate != undefined){
            let delivery = this.getDelivery(component, currDate.addHours(hour*-1));
            stock += delivery;
          }
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

  getDelivery(index: string, day: Date): number{
    let res = 0;
    let s = day.addHours(1).toISOString().substring(0,day.toISOString().length-5);
    let delivery = this.DeliveryItems.find(f=>f.ProductIndex==index && f.DeliveryDate==s);
    if(delivery != undefined){
      res = delivery?.OpenQuantity;
    }
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
            cellStyle: params => this.cellStyle(params),
            width: colWidth,
            type: colType,
            valueFormatter: colFormatter
          })
      }
    }
  }

  dateFormatter(params): string{
    let dateString = params.data.Pokrycie;
    let date = new Date(dateString);
    return date.formatString();
  }

  cellStyle(params): CellStyle{
    var endDate = params.node.data.Pokrycie;
    let endDateWithDeliveries = endDate;
    let component = params.node.data.Produkt;
    let key = params.column.colId;
    let deliveriesEnabled = this.settings.PlanCoverageByDeliveries;

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
      if(deliveriesEnabled){
        endDateWithDeliveries = params.node.data.Pokrycie_dostawami;
        if(hour ==14){
          let delivery = this.getDelivery(component, currDate.addHours(hour*-1));
          if(delivery > 0){
            if(currDate < endDate){
              return {backgroundColor: '#c99c8d', borderColor: 'red red', borderWidth: '3px 3px' ,color: 'black'};
            }else{
              if(deliveriesEnabled && currDate < endDateWithDeliveries){
                return {backgroundColor: '#8b5441', borderColor: 'red red', borderWidth: '3px 3px' ,color: 'black'};
              }
              return {borderColor: 'red red', borderWidth: '3px 3px',color: 'black'};
            }
          }
        }
        
      }
      if(Number(day) == today.getDate() && Number(month) == (today.getMonth()+1) && shift == currShift.toString()){
        //today this very shift 
        if(currDate < endDate){
          return {backgroundColor: '#c99c8d', borderColor: 'transparent #cddc39', borderWidth: '1px 5px' ,color: 'black'};
        }else{
          if(deliveriesEnabled && currDate < endDateWithDeliveries){
            return {backgroundColor: '#8b5441', borderColor: 'transparent #cddc39', borderWidth: '1px 5px' ,color: 'black'};
          }
          return {borderColor: 'transparent #cddc39', borderWidth: '1px 5px',color: 'black'};
        }
      }
      if(currDate <= endDate){
        //other
        return {backgroundColor: '#c99c8d', color: 'black'};
      }else{
        if(deliveriesEnabled && currDate <= endDateWithDeliveries){
          return {backgroundColor: '#8b5441', color: 'black'};
        }
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
    if(params.column.colId.includes("__")){
      let component: ComponentSchedule = {
        PRODUCT_NR: params.data.Produkt,
        PRODUCT_NAME: params.data.Nazwa,
        STOCK: params.data.Zapas,
        SELECTED_PERIOD_START: undefined,
        SELECTED_PERIOD_END: undefined,
        SCHEDULE: undefined,
        DELIVERIES: undefined
      }
      let period = this.colIdToDate(params.column.colId);
      if(period != undefined){
        component.SELECTED_PERIOD_START = period;
        component.SELECTED_PERIOD_END = period.addHours(8);
      }
      if(this.DeliveryItems != undefined){
        let dels = this.DeliveryItems.filter(f=>f.ProductIndex == component.PRODUCT_NR);
        if(dels.length){
          component.DELIVERIES = dels;
        }
      }
      this.showComponentPage(component);
    }
    
  }

  showComponentPage(component: ComponentSchedule): void{
    var spinnerRef = this.spinnerService.start();
    const qry = `OPERATION_DATE >= '${this.firstPlanDate.formatString()}' AND OPERATION_DATE < '${this.firstPlanDate.addDays(7).formatString()}' AND SUB_PROD_TYPE <> 'Półprodukty' AND PRODUCT_NR = '${component.PRODUCT_NR}'&withParents=true`;

    this.componentService.getPlannedComponents(qry).subscribe(
      response => 
      {
        component.SCHEDULE = response;
        component = this.mergeDeliveriesWithPlannedComponents(component);
        component.SCHEDULE = component.SCHEDULE.sort((a,b) => (a.OPERATION_DATE < b.OPERATION_DATE) ? -1 : ((b.OPERATION_DATE < a.OPERATION_DATE) ? 1 : 0))
        component = this.calculateRemainingStock(component);
        this.spinnerService.stop(spinnerRef);
        this.componentPageRef = this.componentService.openComponentSchedulePage(component);
      }, 
      error => (console.log(error))
    );
    
  }

  mergeDeliveriesWithPlannedComponents(component: ComponentSchedule): ComponentSchedule{
    if(component.DELIVERIES != undefined){
      for(let i=0; i< component.DELIVERIES.length; i++){
        let d = new Date(component.DELIVERIES[i].DeliveryDate).addHours(14);
        let del: PlannedComponent = {
          OPERATION_DATE: d.formatString(),
          OPERATION_DAY: d.addHours(14).formatString(),
          OPERATION_WEEK: d.getWeek(),  
          OPERATION_YEAR: d.getFullYear(),
          SHIFT_ID: 2,
          SHIFT_NAME: "Druga",
          MACHINE_NR: "",
          OPERATION_NR: component.DELIVERIES[i].Vendor,
          OPERATION_TYPE_NAME: "DELIVERY",
          ORDER_NR: component.DELIVERIES[i].PurchaseOrder,
          PRODUCT_NR: component.PRODUCT_NR,
          PRODUCT_NAME: component.PRODUCT_NAME,
          PROD_TYPE: "",
          SUB_PROD_TYPE: "",
          ORDER_TYPE_CODE: "PO",
          ORDER_TYPE_NAME: "PO",
          BOM_NR: "",
          PRODUCT_QUANTITY: component.DELIVERIES[i].OpenQuantity,
          PRODUCT_QUANTITY_ALL: component.DELIVERIES[i].OrderQuantity,
          PARENT_NR: "",
          REMAINING_STOCK: 0,
          TYPE: "Dostawa"
        }
        component.SCHEDULE.push(del);
      }
    }
    return component;
  }

  calculateRemainingStock(component: ComponentSchedule): ComponentSchedule{
    let stock = 0;

    if(component.STOCK != undefined){
      stock = component.STOCK;
    }

    for(let i=0; i< component.SCHEDULE.length; i++){
      //add missing data
      if(component.SCHEDULE[i].TYPE == undefined){
        component.SCHEDULE[i].TYPE = "Zużycie";
        component.SCHEDULE[i].PRODUCT_QUANTITY = component.SCHEDULE[i].PRODUCT_QUANTITY * -1;
      }

      //remove already covered production
      if(this.realTimeStockCategories.includes(component.SCHEDULE[i].SUB_PROD_TYPE)){
        let currDate = new Date(component.SCHEDULE[i].OPERATION_DATE);
        let now = new Date();
        if(currDate < now){
          //it's already covered
          component.SCHEDULE[i].PRODUCT_QUANTITY = 0;
        }
      }
      
      component.SCHEDULE[i].REMAINING_STOCK = stock + component.SCHEDULE[i].PRODUCT_QUANTITY;
      stock = component.SCHEDULE[i].REMAINING_STOCK;
    }
    return component;
  }

  colIdToDate(colId: string): Date{
    //translates column name format ("2022-02-23__1") to proper date ("2022-02-23 06:00:00.000")
    try{
      if(colId.includes("__")){
        let datePart = colId.split("__")[0];
        let day = datePart.substring(8,10);
        let month = datePart.substring(5,7);
        let year = datePart.substring(0,4);
        let shift = colId.substring(colId.length-1,colId.length);
        let hour;
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
        return currDate;
      }
    }catch(error){
      console.log(error);
    }
    return undefined;
  }

  removeCoveredProduction(): void{
    //removes production items that already were covered
    //as for some categories stock is taken in real-time
    let today = new Date();

    if(this.realTimeStockCategories.length > 0){
      for(let i=0; i<this.PlannedComponentsSchedule.length; i++){
        if(this.realTimeStockCategories.includes(this.PlannedComponentsSchedule[i].Typ)){
          let x = 0;
          for(let key in this.PlannedComponentsSchedule[i]){
            if(this.PlannedComponentsSchedule[i].hasOwnProperty(key)){
              let currDate = this.colIdToDate(key);
              if(currDate != undefined){
                if(currDate < today){
                  let thisShift = this.PlannedComponentsSchedule[i][key];
                  this.PlannedComponentsSchedule[i][key] = 0;
                }
              }
            }
            x++;
          }
        }
      }
    }
  }

}
