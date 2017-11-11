import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import * as moment from 'moment';
import * as _ from 'underscore';

import { RegisterItem } from '../data-transfer-objects/register-item.class'

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
  isReadOnly: boolean;
  dataSource: TableDataSource | null;
  tableDB: TableDatabase | null;
  displayedColumns = ['ci', 'nombre', 'materialWasDelivered', 'registeredDate'];

  @ViewChild('filter') filter: ElementRef;
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
  
  constructor(public db: AngularFireOfflineDatabase) {
    this.tableDB = new TableDatabase(db);
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
    this.dataSource = new TableDataSource(this.tableDB);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class TableDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<RegisterItem[]> = new BehaviorSubject<RegisterItem[]>([]);
  get data(): RegisterItem[] {
    return this.dataChange.value;
  }

  constructor(public db: AngularFireOfflineDatabase) {
    this.db.list('registered-items').subscribe(data => {
      this.dataChange.next(data as RegisterItem[]);
    });
  }
}

export class TableDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(public db: TableDatabase) {
    super();
  }

  // Connect function called by the table to retrieve one stream containing the data to render.
  connect(): Observable<RegisterItem[]> {
    const displayDataChanges = [
      this.db.dataChange,
      this._filterChange,
    ];

    // return this.db.list('registered-items');
    return Observable.merge(...displayDataChanges).map(() => {
      return this.db.data.slice().filter((item: RegisterItem) => {
        return item.nombre.toLowerCase().indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
