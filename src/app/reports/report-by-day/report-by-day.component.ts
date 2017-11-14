import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RegisterItem } from '../../data-transfer-objects/register-item.class'
import { AppDatabaseService } from '../../app-database.service';

@Component({
  selector: 'report-by-day',
  templateUrl: './report-by-day.component.html',
  styleUrls: ['./report-by-day.component.less']
})

export class ReportByDayComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @Input() date: string;
  
  dataSource: TableDataSource | null;
  tableDB: TableDatabase | null;

  displayedColumns = ['ci', 'nombre', 'materialWasDelivered', 'registeredDate'];
  
  constructor(private db: AppDatabaseService) { }

  ngOnInit() {
    this.tableDB = new TableDatabase(this.db, this.date);
    this.dataSource = new TableDataSource(this.tableDB);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(100)
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

  constructor(private db: AppDatabaseService, private date: string) {
    this.db.loadRegisteredItems();
    
    this.db.registeredItems[date].subscribe(data => {
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
