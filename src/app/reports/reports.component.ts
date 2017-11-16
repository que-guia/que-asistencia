import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import * as moment from 'moment';
import * as _ from 'underscore';

import { AppDatabaseService } from '../app-database.service';
import { RegisterItem } from '../data-transfer-objects/register-item.class';
import { FORMAT_DATE_SHORT } from '../app.constants';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})

export class ReportsComponent implements OnInit {
  @ViewChild('testChart') testChart: BaseChartDirective;

  datasets = [{
    fill: false,
    borderColor: '#ff4081',
    data: [],
  }];

  options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: "time",
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Hora de Registro'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#ff4081'
          }
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Asistentes'
        }
      }]
    }
  };
  
  constructor(public db: AppDatabaseService) {
    this.db.loadRegisteredItems();
    this.db.registeredItems.subscribe(data => {
      const tempEntries = {};
      const [dataset] = this.datasets;
      this.datasets[0].data = [];

      (data as RegisterItem[]).forEach(({dateEntries}) => {
        _.each(dateEntries || [], dateEntry => {
          tempEntries[dateEntry] = (tempEntries[dateEntry] || 0) + 1;
        })
      });

      _.each(tempEntries, (y, date) => {
        const x = moment(date, 'DD-MM-YYYY HH:mm').format();
        dataset.data.push({x, y})
      });
 
      this.datasets = this.datasets.slice();
    });
  }

  ngOnInit() {}
}
