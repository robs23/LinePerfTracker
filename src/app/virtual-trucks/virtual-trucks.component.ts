import { Component, OnInit } from '@angular/core';
//// import { Timeline, TimelineOptions, DataItem, DataSet } from 'vis-timeline/standalone';
// import { Timeline } from 'vis-timeline';
// import { DataSet } from 'vis-data';

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
    // var container = document.getElementById('visualization');

    // var items = new DataSet([
    //   {id: 1, content: 'item 1', start: '2014-04-20'},
    //   {id: 2, content: 'item 2', start: '2014-04-14'},
    //   {id: 3, content: 'item 3', start: '2014-04-18'},
    //   {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    //   {id: 5, content: 'item 5', start: '2014-04-25'},
    //   {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
    // ]);
  
    // // Configuration for the Timeline
    // var options = {};
  
    // // Create a Timeline
    // var timeline = new Timeline(container, items, options);
  }
}
