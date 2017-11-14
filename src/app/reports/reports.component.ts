import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import * as moment from 'moment';
import * as _ from 'underscore';

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

  dates = [{
    value: '12/11/2017'
  }, {
    value: '13/11/2017'
  }, {
    value: '14/11/2017'
  }];

  activeTabIndex = Math.max(0, _.findIndex(this.dates, {
    value: moment().format(FORMAT_DATE_SHORT)
  }));

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
  
  constructor(public db: AngularFireOfflineDatabase) {
    // this.tableDB = new TableDatabase(db);
    this.db.list('registered-items').subscribe(data => {
      const tempEntries = {};
      const [dataset] = this.datasets;
      this.datasets[0].data = [];

      (data as RegisterItem[]).forEach(({dateEntries}) => {
        const [registeredDate] = dateEntries;
        tempEntries[registeredDate] = (tempEntries[registeredDate] || 0) + 1;
      });

      _.each(tempEntries, (y, date) => {
        const x = moment(date, 'DD-MM-YYYY HH:mm').format();
        dataset.data.push({x, y})
      });
 
      this.datasets = this.datasets.slice();
    });
  }

  ngOnInit() {
    // this.dataSource = new TableDataSource(this.tableDB);

    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if (!this.dataSource) { return; }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });
  }
}
