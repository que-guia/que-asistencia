import { Component, OnInit } from '@angular/core';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Item } from '../data-transfer-objects/item.class';

@Component({
  selector: 'registered-items',
  styleUrls: ['./registered-items.component.less'],
  templateUrl: './registered-items.component.html'
})

export class RegisteredItemsComponent implements OnInit {
  items: AfoListObservable<Item[]>;

  constructor(private database: AngularFireOfflineDatabase) {
    this.items = this.database.list('/items');
  }

  ngOnInit() { }
}
