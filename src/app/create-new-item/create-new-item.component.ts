import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AfoObjectObservable, AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import * as moment from 'moment';
import * as shortid  from 'shortid';

import { AppDatabaseService } from '../app-database.service';
import { Item } from '../data-transfer-objects/item.class';
import { Error } from './create-new-item.errors';
import { FORMAT_DATE_SHORT } from '../app.constants';
import { error } from 'util';
import { Tree } from '@angular/router/src/utils/tree';

@Component({
  selector: 'create-new-item',
  templateUrl: './create-new-item.component.html',
  styleUrls: ['./create-new-item.component.less']
})

export class CreateNewItemComponent implements OnInit {
  myForm: FormGroup;  
  personaQueRecibio: FormControl;
  celular: FormControl;
  nombre: FormControl;
  ci: FormControl;
  @Input() item: Item;
  @Input() options = ['NO', 'SI'];

  items: Item[];
  error: Error;
  formControl: FormControl;
  ciInvalid: boolean = false;
  
  constructor(private fb: FormBuilder,
              private appDatabase: AppDatabaseService,
              private offlineDatabase: AngularFireOfflineDatabase) {
    this.error = new Error();
    this.formControl = new FormControl();
    this.item = new Item();
    this.item['pago-efectivo'] = 'NO';
    this.item.fecha = new Date();
    this.item.fechaRegistro = new Date();

    // Validations
    this.nombre = new FormControl(this.item.nombre, [Validators.required]);
    this.ci = new FormControl(this.item.ci, [Validators.required, this.ValidateCI()]);
    this.celular = new FormControl(this.item.celular, [Validators.required]);
    this.personaQueRecibio = new FormControl(this.item['persona-que-recibio'], [Validators.required]);

    this.appDatabase.getItems().then(items => this.items = items);
  }

  ngOnInit() { }

  registerItem() {
    this.item.pagoEfectivoPersonaQueRecibio = `${this.item['pago-efectivo']} - ${this.item['persona-que-recibio']}`;
  
    // this.error.nombre = 'Ingrese el Nombre';

    // this.offlineDatabase.object(`/items/${this.item.ci}`)
    //   .update(this.item)
    //   .then(() => {
    //     console.info('ITEM has been registered');
    //   })
    //   .catch();

    this.ciInvalid = true;
  }

  getErrorMessage(field: string): string {
    let errorMessage = '';

    if (field === 'nombre')  {
      errorMessage = this.nombre.hasError('required') ? 'Nombre del participante es requerido' : '';
    }
    if (field === 'ci')  {
      errorMessage = this.ci.hasError('required') ? 'CI del participante es requerido' : 
        this.ci.hasError('validCI') ? 'CI ya se encuentra en uso' : '';
    }
    if (field === 'celular')  {
      errorMessage = this.celular.hasError('required') ? 'Nro Telf/Celular del participante es requerido' : '';
    }
    if (field === 'personaQueRecibio') {
      errorMessage = this.personaQueRecibio.hasError('required') ? 'Persona que Recibio es requerido' : '';
    }

    return errorMessage;
  }

  ValidateCI() {
    const me = this;

    return function(control: AbstractControl) {
      const foundCI = (me.items || []).find(item => `${item.ci}`.toLowerCase() === `${control.value || ''}`.toLowerCase());
      
      if (foundCI) {
        return { validCI: true }
      }
    
      return null;
    }
  }
}
