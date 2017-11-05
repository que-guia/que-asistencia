import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  dataSource: TableDataSource | null;
  tableDB: TableDatabase | null;
  displayedColumns = ['ci', 'nombre', 'materialWasDelivered', 'registeredDate'];

  @ViewChild('filter') filter: ElementRef;

  private datasets = [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3]
    }
  ];

  private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  private options = {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  
  constructor(public db: AngularFireOfflineDatabase) {
    this.tableDB = new TableDatabase(db);
  }

  ngOnInit() {
    this.dataSource = new TableDataSource(this.tableDB);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
        // console.log(this.filter.nativeElement.value)
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
    })
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
