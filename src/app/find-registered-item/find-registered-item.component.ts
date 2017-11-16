import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Item } from '../data-transfer-objects/item.class';
import { AppDatabaseService } from '../app-database.service';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { CreateItemMessageComponent } from '../create-new-item/create-new-item-message/create-new-item-message.component';

import * as moment from 'moment';

@Component({
  selector: 'find-registered-item',
  styleUrls: ['./find-registered-item.component.less'],
  templateUrl: './find-registered-item.component.html'
})

export class FindRegisteredItemComponent implements OnInit {
  stateCtrl: FormControl;
  nameCtrl: FormControl;
  options: FormGroup;
  items: Item[];

  searchText: '';
  filteredItems: Observable<any[]>;
  filteredItemsByName: Observable<any[]>;

  foundItem: Item;
  @Input() selectedItem: Item;
  @ViewChild('filter') filter: ElementRef;

  isValid = false;
  displayedColumns = ['ci', 'nombre', 'update'];
  dataSource: TableDataSource | null;
  tableDB: TableDatabase | null;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private db: AppDatabaseService,
              private offlineDatabase: AngularFireOfflineDatabase) {
    
    this.foundItem = null;
    this.selectedItem = null;
    this.stateCtrl = new FormControl();
    this.nameCtrl = new FormControl();
    this.options = fb.group({
      hideRequired: false,
      floatPlaceholder: 'auto',
    });

    this.filteredItems = this.stateCtrl.valueChanges
      .debounceTime(100)
      .startWith(null)
      .map(text => text ? this.filterItems(text) : null);
  }

  ngOnInit() {
    this.db.items.subscribe(data => this.items = data);

    this.tableDB = new TableDatabase(this.db);
    this.dataSource = new TableDataSource(this.tableDB);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  filterItems(text: string) {
    return (this.items || []).filter(item => 
      item.ci.toString().indexOf(text.toString().toLowerCase()) === 0 || item.nombre.toLowerCase().indexOf(text.toString().toLowerCase()) !== -1);
  }

  selectItem(item) {
    this.selectedItem = item;
    this.isValid = true;
  }

  cleanSelectedItem() {
    this.selectedItem = null;
    this.searchText = '';
    this.filter
  }

  updateItem() {
    const itemToUpdate = {
      ci: this.selectedItem.ci,
      nombre: this.selectedItem.nombre || '',
      ciudad: this.selectedItem.ciudad || '',
      celular: this.selectedItem.celular || '',
      correo: this.selectedItem.correo || ''
    }
    
    const item = this.offlineDatabase.object(`/items/${this.selectedItem.id}`);

    item
      .update(itemToUpdate)
      .then(() => {
        console.info('ITEM has been updated');
      });

    this.snackBar.openFromComponent(CreateItemMessageComponent, {
      duration: 800,
      data: {
        success: 'Informa del Asistente ha sido actualizada.'
      }
    });
  }

  tabChanged($event) {
    this.searchText = '';
    this.selectedItem = null;
  }

  textHasChanged() {
    if (!this.searchText) {
      this.selectedItem = null;
    }
  }

  displayFn(item: Item): String {
    return item ? `${item.ci}, ${item.nombre}` : null;
  }

  findItem() {
    if (this.selectedItem && this.selectedItem.ci) {
      this.foundItem = this.items.find(({ci}) => ci === this.selectedItem.ci);
    }
  }
}

export class TableDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  get data(): Item[] {
    return this.dataChange.value;
  }

  constructor(private db: AppDatabaseService) {    
    this.db.items.subscribe(data => {
      const itemsWithProblem = (data || []).filter(({hasProblemWithCI}) => hasProblemWithCI);
      this.dataChange.next(itemsWithProblem);
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

  connect(): Observable<Item[]> {
    const displayDataChanges = [
      this.db.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.db.data.slice().filter((item: Item) => {
        return `${item.ci || ''}`.indexOf(`${this.filter || ''}`.toLowerCase()) === 0 ||
          item.nombre.toLowerCase().indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
