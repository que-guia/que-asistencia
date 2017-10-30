import { Component, OnInit } from '@angular/core';
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})

export class ReportsComponent implements OnInit {
  items: Observable<any[]>;
  
  constructor(public db: AngularFireDatabase) {
    this.items = db.list('items').valueChanges();
    debugger    
  }

  ngOnInit() { }
}
