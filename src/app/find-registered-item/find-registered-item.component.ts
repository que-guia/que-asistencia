import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { Item } from '../data-transfer-objects/item.class';
import { AppDatabaseService } from '../app-database.service';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { CreateItemMessageComponent } from '../create-new-item/create-new-item-message/create-new-item-message.component';

import * as moment from 'moment';

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

  isValid = false;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
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
      .debounceTime(100)
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
    this.isValid = true;
  }

  updateItem() {
    const itemToUpdate = {
      ci: this.selectedItem.ci,
      nombre: this.selectedItem.nombre,
      ciudad: this.selectedItem.ciudad,
      celular: this.selectedItem.celular,
      correo: this.selectedItem.correo
    }
    
    const item = this.offlineDatabase.object(`/items/${this.selectedItem.id}`);

    item
      .update(itemToUpdate)
      .then(() => {
        console.info('ITEM has been updated');
      });

    this.snackBar.openFromComponent(CreateItemMessageComponent, {
      duration: 800,
      data: {
        success: 'Informa del Asistente ha sido actualizada.'
      }
    });
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
