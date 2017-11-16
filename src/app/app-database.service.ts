import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Item } from './data-transfer-objects/item.class';
import { RegisterItem } from './data-transfer-objects/register-item.class';
import { Promise } from 'firebase/app';
import { forEach } from '@angular/router/src/utils/collection';

import * as _ from 'underscore';
import { startWith } from 'rxjs/operator/startWith';

@Injectable()
export class AppDatabaseService {
  currentItems: Item[] = [];
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  registeredItems: BehaviorSubject<RegisterItem[]> = new BehaviorSubject<RegisterItem[]>([]);

  constructor(private http: Http,
              public db: AngularFireOfflineDatabase) {
    this.http.get("assets/js/temp-registered-items.json")
      .toPromise()
      .then(response => {
        this.currentItems = response.json() as Item[];
        this.items.next(this.currentItems);
      });

    this.db.list('items').subscribe(data => {
      // Bulk
      const items = data as Item[];
      _.each(items.filter(({hasProblemWithCI}) => !hasProblemWithCI),
        item => {
          const {id, ci, nombre, ciudad, celular, correo} = item;
          const foundIndex = _.findIndex(this.currentItems, item => `${ci}` === `${item.ci}`)
          
          if (foundIndex >= 0) {
            _.extend(this.currentItems[foundIndex], {id, ci, nombre, ciudad, celular, correo});  
          } else {
            this.currentItems.push(item);
          }
      });

      // Publish
      this.items.next([...this.currentItems, ...(items || []).filter(({hasProblemWithCI}) => hasProblemWithCI)]);
    });
  }

  loadRegisteredItems() {
    this.db.list('registered-items').subscribe(data => {
      this.registeredItems.next(data);
    });
  }
}
