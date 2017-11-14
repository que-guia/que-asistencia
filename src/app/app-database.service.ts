import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Item } from './data-transfer-objects/item.class';
import { Promise } from 'firebase/app';
import { forEach } from '@angular/router/src/utils/collection';

import * as _ from 'underscore';

@Injectable()
export class AppDatabaseService {
  dates = ['12/11/2017', '13/11/2017', '14/11/2017'];
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  registeredItems = {};
  currentItems: Item[] = [];

  constructor(private http: Http,
              public db: AngularFireOfflineDatabase) {
    
    this.dates.forEach(date => {
      this.registeredItems[date] = new BehaviorSubject<Item[]>([]);
    }); 

    this.http.get("assets/js/temp-registered-items.json")
      .toPromise()
      .then(response => this.currentItems = response.json() as Item[]);

    this.db.list('items').subscribe(data => {
      this.items.next([...this.currentItems, ...data as Item[]]);
    });
  }

  loadRegisteredItems() {
    this.db.list('registered-items').subscribe(data => {
      this.dates.forEach(date => {
        const registeredItems = (data || []).filter(({dateEntries}) => {
          return (dateEntries || []).find(dateEntry => `${dateEntry}`.startsWith(date));
        });

        this.registeredItems[date].next(registeredItems);
      });
    });
  }
}
