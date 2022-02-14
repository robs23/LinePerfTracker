import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannedComponentsService } from '../services/planned-components.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
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
  private gridOptions: GridOptions;

  constructor(private componentService: PlannedComponentsService, private params: ActivatedRoute, private spinnerService: SpinnerService, private userInteractionService: UserInteractionService) {
    this.exportButtonClickedSub = userInteractionService.exportClicked$.subscribe(
      value => {
        //this.exportToExcel();
        this.jasonToExcel();
      }
    )
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
        const qry = `OPERATION_DATE >= '${firstDateString}' AND OPERATION_DATE < '${lastDateString}'`;
        this.componentService.getComponentsScheduleAndDeliveries(qry).subscribe(responseList => {
          this.PlannedComponentsSchedule = responseList[0];
          this.DeliveryItems = responseList[1];
          this.addInventoryColumn();
          this.setDynamicHeaders();
          this.spinnerService.stop(spinnerRef);
        });
      })
  }

  addInventoryColumn(): void{
    this.PlannedComponentsSchedule.forEach(function(element){
      let ind = element.Produkt;
      let x = this.InventorySnapshots.length;
      let stock = this.InventorySnapshots.find(f=>f.ProductIndex == ind && f.Status == "U")?.Size;
      if(stock == undefined){
        stock = 0;
      }
      element.Zapas = stock;
    });
  }

  // addInventoryColumn(): void{
  //   for(let i = 0; i < this.PlannedComponentsSchedule.length; i++){
  //     let ind = this.PlannedComponentsSchedule[i].Produkt;
  //     let stock = this.InventorySnapshots.find(f=>f.ProductIndex == ind && f.Status == "U")?.Size;

  //     if(stock == undefined){
  //       stock = 0;
  //     }
  //     this.PlannedComponentsSchedule.map(obj => ({obj, Zapas: stock}));
  //   }
  // }


  setDynamicHeaders(): void{
    var p = this.PlannedComponentsSchedule[0];
    this.colDefs = [];
    for (var key in p) {
      if (p.hasOwnProperty(key)) {
        let hName = key;
        let isPinned = true;

        if(key.includes("__")){
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
          hName = `${day}.${month} ${shift}`
        }
          
          this.colDefs.push({
            headerName: hName,
            field: key,
            sortable: true,
            filter: true,
            resizable: true,
            pinned: isPinned
          })
          //console.log(key + " -> " + p[key]);
      }
  }
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

}
