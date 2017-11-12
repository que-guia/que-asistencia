import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Item } from '../data-transfer-objects/item.class';
import { AppDatabaseService } from '../app-database.service';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';

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

  constructor(private fb: FormBuilder,
              private appDatabase: AppDatabaseService,
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
      .startWith(null)
      .map(text => text ? this.filterItems(text) : null);
  }

  ngOnInit() {
    this.appDatabase.items.subscribe(data => this.items = data);
  }

  filterItems(text: string) {
    return (this.items || []).filter(item => 
      item.ci.toString().indexOf(text.toString().toLowerCase()) === 0 || item.nombre.toLowerCase().indexOf(text.toString().toLowerCase()) !== -1);
  }

  selectItem(item) {
    this.selectedItem = item;
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
