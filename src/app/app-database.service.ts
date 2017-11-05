import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { Item } from './data-transfer-objects/item.class';

@Injectable()
export class AppDatabaseService {

  constructor(private http: Http) {
    var obj;
    // this.getItems().subscribe(data => obj=data, error => console.log(error));
  }

  getItems(): Promise<Item[]> {
    return this.http.get("assets/js/temp-registered-items.json")
                    .toPromise()
                    .then(response => response.json() as Item[]);

  }
}
