import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { VirtualTruck } from '../interfaces/virtual-truck';
import { VirtualTruckService } from '../services/virtual-truck.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexLegend,
  ApexGrid,
  ApexStroke,
  ApexAnnotations,
  NgApexchartsModule
} from "ng-apexcharts";
import { config } from 'rxjs';
import { VirtualTruckItemsComponent } from '../virtual-truck-items/virtual-truck-items.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  stroke: ApexStroke;
  annotation: ApexAnnotations
};

var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00D9E9",
  "#FF66C3"
];

@Component({
  selector: 'app-virtual-trucks-chart',
  templateUrl: './virtual-trucks-chart.component.html',
  styleUrls: ['./virtual-trucks-chart.component.css']
})
export class VirtualTrucksChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @Input() trucks;
  public chartOptions: Partial<ChartOptions>;
  unicorns: string[] = Array(); // Unique L-plants
  truckPageRef;

  constructor(private vtService: VirtualTruckService) { 
    
  }

  ngOnInit() {
    this.createChart();
  }

  getUniqueLplants(trucks: VirtualTruck[]){
    for(var t of trucks){
        if(this.unicorns.filter(x=>x==t.L).length == 0){
          //L is unique
          this.unicorns.push(t.L);
        }
    }
    this.unicorns.sort();
  }

  prepareData(): any{
    let dSeries: any;
    let dSerie: any;

    this.getUniqueLplants(this.trucks);

    dSeries = [];
    let sCounter: number = 0; // series 
    let dpCounter: number = 0; // data point
    

    for(var u of this.unicorns){
      var ddata = [];
      let dd: any;
      dpCounter=0;

      for(var t of this.trucks.filter(f=>f.L == u)){
        dd = {
          x: "|",
          y: [new Date(t.ProductionStart).getTime(), new Date(t.ProductionEnd).getTime()]
        }
        ddata.push(dd);
        t.SeriesIndex = sCounter;
        t.DataPointIndex = dpCounter;
        dpCounter++;
      }

      dSerie = 
      {
        name: u,
        data: ddata
      }
      dSeries.push(dSerie);
      sCounter++;
    }
    
    return dSeries;
  }

  createChart(): void{
    this.chartOptions = {
      series: this.prepareData(),
      chart: {
        height: 650,
        type: "rangeBar",
        events: {
          dataPointSelection: (e, chart, opts) => {
            this.showTruckPage(e, chart, opts);
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "100%",
          borderRadius: 1
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: 'dd/MM',
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 100]
        }
      },
      legend: {
        position: "left",
        horizontalAlign: "center",
        itemMargin: {
          vertical: 5.5
        }
      },
      grid: {
        show: true,
        position: 'front',
        xaxis: {
          lines: {
              show: true
          }
        }, 
      },
      annotation: {
        xaxis: [
          {
            x: new Date().getTime(),
            borderColor: '#775DD0',
            label: {
              style: {
                color: '#fff',
              },
              text: 'Dupa'
            }
          }
        ]
      }
    };

  }

  showTruckPage(e, chart, opts): void{
    let currTruck: VirtualTruck;
    currTruck = this.trucks.filter(i=>i.SeriesIndex==opts.seriesIndex && i.DataPointIndex==opts.dataPointIndex);
    this.truckPageRef = this.vtService.openItemsPage(currTruck);
    console.log("Seria: " + opts.seriesIndex + ", punkt: " + opts.dataPointIndex);
  }

}
