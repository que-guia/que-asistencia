import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import { AppDatabaseService } from '../app-database.service';
import { Item } from '../item.class';

@Component({
  selector: 'register-item',
  templateUrl: './register-item.component.html',
  styleUrls: ['./register-item.component.less']
})

export class RegisterItemComponent implements OnInit {
  stateCtrl: FormControl;
  items: Item[];
  filteredItems: Observable<any[]>;
  @Input() selectedItem: Item;

  reactiveItems: AfoListObservable<any[]>;
  
  constructor(private appDatabase: AppDatabaseService, private offlineDatabase: AngularFireOfflineDatabase) {
    this.selectedItem = new Item();
    this.stateCtrl = new FormControl();
    this.filteredItems = this.stateCtrl.valueChanges
        .startWith(null)
        .map(item => item ? this.filterItems(item) : [(this.items || []).slice(0, 5)]);

    this.reactiveItems = this.offlineDatabase.list('/items');
  }

  ngOnInit() {
    // this.appDatabase.getItems().then(items => {
    //   this.items = items
    // });
  }

  addItem(item: Item) {

  }

  filterItems(ci: string) {
    return (this.items || []).filter(item => item.ci.toString().indexOf(ci.toString().toLowerCase()) === 0);
  }

  selectItem(item) {
    this.selectedItem = item;
  }
}
