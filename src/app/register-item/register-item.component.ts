import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as shortid  from 'shortid';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AfoObjectObservable, AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import { AppDatabaseService } from '../app-database.service';
import { Item } from '../data-transfer-objects/item.class';
import { RegisterItem } from '../data-transfer-objects/register-item.class';

import { RegisterItemMessageComponent } from './register-item-message/register-item-message.component';

@Component({
  selector: 'register-item',
  templateUrl: './register-item.component.html',
  styleUrls: ['./register-item.component.less']
})

export class RegisterItemComponent implements OnInit {
  stateCtrl: FormControl;
  nameCtrl: FormControl;
  options: FormGroup;
  items: Item[];
  filteredItems: Observable<any[]>;
  filteredItemsByName: Observable<any[]>;
  @Input() selectedItem: Item;
  registeredItem: AfoObjectObservable<Item>;
  filteredCI: string;
  materialWasDelivered: boolean;

  reactiveItems: AfoListObservable<any[]>;
  
  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private appDatabase: AppDatabaseService,
              private offlineDatabase: AngularFireOfflineDatabase) {

    this.selectedItem = new Item();
    this.stateCtrl = new FormControl();
    this.nameCtrl = new FormControl();
    this.options = fb.group({
      hideRequired: false,
      floatPlaceholder: 'auto',
    });

    this.filteredItems = this.stateCtrl.valueChanges
      .startWith(null)
      .map(item => item ? this.filterItems(item) : null);

    this.reactiveItems = this.offlineDatabase.list('/items');
  }

  ngOnInit() {
    this.appDatabase.getItems().then(items => {
      this.items = items
    });
  }

  registerItem() {
    const newID = shortid.generate();
    const itemToRegister = new RegisterItem(this.selectedItem, this.materialWasDelivered);

    this.offlineDatabase
      .object(`/registered-items/${newID}`)
      .update(itemToRegister)
      .then(() => {
        console.info('ITEM has been registered');
      });

    this.snackBar.openFromComponent(RegisterItemMessageComponent, {
      duration: 800,
    });

    this.materialWasDelivered = false;
    this.selectedItem = new Item();
    this.filteredCI = '';
  }

  filterItems(ci: string) {
    return (this.items || [])
      .filter(item => item.ci.toString().indexOf(ci.toString().toLowerCase()) === 0)
      .slice(0, 5);
  }

  selectItem(item) {
    this.selectedItem = item;
  }

  ciHasChanged() {
    if (!this.filteredCI) {
      this.selectedItem.nombre = '';
      this.selectedItem.ciudad = '';
      this.selectedItem.celular = ''; 
      this.selectedItem.correo = '';      
    }
  }
}
