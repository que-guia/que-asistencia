import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Item } from './data-transfer-objects/item.class';
import { Promise } from 'firebase/app';

@Injectable()
export class AppDatabaseService {
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  currentItems: Item[] = [];

  constructor(private http: Http,
              public db: AngularFireOfflineDatabase) {
    this.http.get("assets/js/temp-registered-items.json")
      .toPromise()
      .then(response => this.currentItems = response.json() as Item[]);

    this.db.list('items').subscribe(data => {
      this.items.next([...this.currentItems, ...data as Item[]]);
    });
  }
}
