import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as shortid  from 'shortid';
import * as moment from 'moment';
import * as _ from 'underscore';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AfoObjectObservable, AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import { AppDatabaseService } from '../app-database.service';
import { Item } from '../data-transfer-objects/item.class';
import { RegisterItem } from '../data-transfer-objects/register-item.class';
import { FORMAT_DATE_COMPLETE } from '../app.constants';

import { RegisterItemMessageComponent } from './register-item-message/register-item-message.component';
import { debug } from 'util';

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
  registeredItems: RegisterItem[] = [];
  filteredItems: Observable<any[]>;
  @Input() selectedItem: Item;
  registeredItem: AfoObjectObservable<Item>;
  filteredCI: string;
  materialWasDelivered: boolean;
  materialWasDeliveredIsValid: boolean = true;
  materialDeliveryDate: string;
  message = 'Material entregado';
  isValid = false;
  
  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private db: AppDatabaseService,
              private offlineDatabase: AngularFireOfflineDatabase) {

    this.selectedItem = new Item();
    this.stateCtrl = new FormControl();
    this.nameCtrl = new FormControl();
    this.options = fb.group({
      hideRequired: false,
      floatPlaceholder: 'auto',
    });

    this.db.loadRegisteredItems();
    this.db.items.subscribe(data => this.items = data);
    this.db.registeredItems.subscribe(data => this.registeredItems = data);

    this.filteredItems = this.stateCtrl.valueChanges
      .debounceTime(100)
      .startWith(null)
      .map(item => item ? this.filterItems(item) : null);
  }

  ngOnInit() {}

  registerItem() {
    const itemToRegister = new RegisterItem(this.selectedItem, this.materialWasDelivered, this.materialDeliveryDate);
    
    const item = this.offlineDatabase.object(`/registered-items/${itemToRegister.id}`);
    item.subscribe(dbItem => {
      itemToRegister.dateEntries = dbItem['dateEntries'] || [];
    })

    const newEntryDate = moment(Date.now()).format(FORMAT_DATE_COMPLETE);
    itemToRegister.dateEntries.push(newEntryDate);

    item
      .update(itemToRegister)
      .then(() => {
        console.info('ITEM has been registered');
      });

    if (!this.selectedItem.id) {      
      const itemDB = this.offlineDatabase.object(`/items/${itemToRegister.id}`);

      itemDB
        .update({
          id: itemToRegister.id,
          ci: itemToRegister.ci,
          nombre: this.selectedItem.nombre,
          ciudad: this.selectedItem.ciudad,
          celular: this.selectedItem.celular,
          correo: this.selectedItem.correo,
          hasProblemWithCI: this.selectedItem.hasProblemWithCI || false
        })
        .then(() => {
          console.info('ITEM has been registered');
        });
    }

    this.snackBar.openFromComponent(RegisterItemMessageComponent, {
      duration: 800,
    });

    this.materialWasDelivered = false;
    this.selectedItem = new Item();
    this.filteredCI = '';
    this.isValid = false;
  }

  filterItems(text: string) {
    return (this.items || [])
      .filter(item => item.ci.toString().indexOf(text.toString().toLowerCase()) === 0 ||
        item.nombre.toLowerCase().indexOf(text.toString().toLowerCase()) !== -1)
      .slice(0, 5);
  }

  selectItem(item) {
    this.isValid = true;
    this.selectedItem = item;
    const registedItem = _.findWhere(this.registeredItems, {id: item.id});
    this.materialWasDelivered = false;
    this.materialWasDeliveredIsValid = true;
    this.message = 'Material entregado';

    if (registedItem) {
      this.materialWasDeliveredIsValid = false;
      this.materialWasDelivered = registedItem.materialWasDelivered;
      this.materialDeliveryDate = registedItem.materialDeliveryDate;
      this.message = 'Material ya fue entregado';
    }
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
