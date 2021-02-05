import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { VirtualTruck } from '../interfaces/virtual-truck';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexLegend,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
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

  constructor() { 
    
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
    

    for(var u of this.unicorns){
      var ddata = [];
      let dd: any;

      for(var t of this.trucks.filter(f=>f.L == u)){
        dd = {
          x: "Plan",
          y: [new Date(t.ProductionStart).getTime(), new Date(t.ProductionEnd).getTime()]
        }
        ddata.push(dd);
      }

      dSerie = 
      {
        name: u,
        data: ddata
      }
      dSeries.push(dSerie);
    }
    return dSeries;
  }

  createChart(): void{
    this.chartOptions = {
      series: this.prepareData(),
      chart: {
        height: 450,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%"
        }
      },
      xaxis: {
        type: "datetime"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      }
    };
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "L064",
    //       data: [
    //         {
    //           x: "Plan",
    //           y: [
    //             new Date("2019-03-05").getTime(),
    //             new Date("2019-03-08").getTime()
    //           ]
    //         },
    //         {
    //           x: "Plan",
    //           y: [
    //             new Date("2019-03-01").getTime(),
    //             new Date("2019-03-03").getTime()
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       name: "L048",
    //       data: [
    //         {
    //           x: "Plan",
    //           y: [
    //             new Date("2019-03-02").getTime(),
    //             new Date("2019-03-05").getTime()
    //           ]
    //         },
    //         {
    //           x: "Plan",
    //           y: [
    //             new Date("2019-03-06").getTime(),
    //             new Date("2019-03-16").getTime()
    //           ]
    //         }
    //       ]
    //     }
    //   ],
    //   chart: {
    //     height: 450,
    //     type: "rangeBar"
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: true,
    //       barHeight: "80%"
    //     }
    //   },
    //   xaxis: {
    //     type: "datetime"
    //   },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shade: "light",
    //       type: "vertical",
    //       shadeIntensity: 0.25,
    //       gradientToColors: undefined,
    //       inverseColors: true,
    //       opacityFrom: 1,
    //       opacityTo: 1,
    //       stops: [50, 0, 100, 100]
    //     }
    //   },
    //   legend: {
    //     position: "top",
    //     horizontalAlign: "left"
    //   }
    // };
  }

}
