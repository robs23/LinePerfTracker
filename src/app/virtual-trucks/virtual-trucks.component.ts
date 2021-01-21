import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { timeline } from 'node_modules/chartjs-chart-timeline';

@Component({
  selector: 'app-virtual-trucks',
  templateUrl: './virtual-trucks.component.html',
  styleUrls: ['./virtual-trucks.component.css']
})
export class VirtualTrucksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.createChart();
  }

  createChart(): void {
    var myChart = new Chart("virtualTrucksChart", {
      type: 'timeline',
      "options": {
        // Depricated and will be removed in future. Please use elements.* instead.
        // "colorFunction": function(text, data, dataset, index) {
        //     return Chart.helpers.color('black');
        // },
        // "showText": true,
        // "textPadding": 4
        "elements": {
            "colorFunction": function(text, data, dataset, index) {
                return Chart.helpers.color('black');
                // return '#black'; supported in 0.4.0
            },
            "showText": true,
            "textPadding": 4
        }
    },
    "data": {
        "labels": [
            "Cool Graph",
            "heater1"
        ],
        "datasets": [
            {
                "data": [
                    [
                        "2018-01-22T16:00:00.000Z",
                        "2018-01-23T05:40:44.626Z",
                        "Unknown"
                    ]
                ]
            },
            {
                "data": [
                    [
                        "2018-01-22T16:00:00.000Z",
                        "2018-01-23T04:57:43.736Z",
                        "On"
                    ],
                    [
                        "2018-01-23T04:57:43.736Z",
                        "2018-01-23T04:57:55.437Z",
                        "Off"
                    ],
                    [
                        "2018-01-23T04:57:55.437Z",
                        "2018-01-23T05:40:44.626Z",
                        "On"
                    ]
                ]
            }
        ]
    },
    });
  }

}
