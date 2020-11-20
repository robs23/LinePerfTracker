import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { ScanningItem } from '../scanningItem';
import { PerformanceChartItem } from '../interfaces/performance-chart-item';
import { ScanningItemsTransformer } from '../scanning-items-transformer';

@Component({
  selector: 'app-performance-chart',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.css'],
})
export class PerformanceChartComponent implements OnInit {

  @Input() scanningItems;
  items: PerformanceChartItem[];
  private scanningItemsTransformer = new ScanningItemsTransformer();
  hours: number[];
  ges: number[];
  foil: number[];
  quantities: number[];
  backgroundColors: string[];
  borderColors: string[];

  ngOnInit() {
    this.prepareData();
    this.createChart();
  }

  prepareData(): void{
    this.items = this.scanningItemsTransformer.consolidate(this.scanningItems);
    this.hours = this.items.map(i=> i.hour);
    this.ges = this.items.map(i=> i.ge);
    this.foil = this.items.map(i=> i.foilLossPercentage);
    this.quantities = this.items.map(i=> i.quantityKg);
    this.backgroundColors = this.items.map(i => i.backgroundColor);
    this.borderColors = this.items.map(i => i.borderColor);
  }

  

  createChart(): void {
    var myChart = new Chart("performanceChart", {
      type: 'line',
      data: {
        labels: this.hours,
        datasets: [
          {
            label: 'GE [%]',
            data: this.ges,
            yAxisID: 'A',
            borderColor: [
              'rgba(10, 10, 10, 1)'
            ],
            backgroundColor: [
              'rgba(0, 0, 0, 0)'
            ],
            borderWidth: 3,
          },
          {
            label: 'Strata folii [%]',
            data: this.foil,
            yAxisID: 'A',
            borderColor: [
              'rgba(161, 0, 255,1)',
            ],
            backgroundColor: [
              'rgba(0, 0, 0, 0)'
            ],
            borderWidth: 2,
          }
          ,
          {
            label: 'Ilość [KG]',
            data: this.quantities,
            yAxisID: 'B',
            backgroundColor: this.backgroundColors,
            borderColor: this.borderColors,
            borderWidth: 1,
            type: 'bar'
          }
        ],
      },
      options: {
        scales: {
          yAxes: [{
            id: 'A',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: '%'
            }
          },{
            id: 'B',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'KG'
            }
          }],
        },
      },
    });
  }
}
