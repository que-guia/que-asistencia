import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AfoObjectObservable, AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import * as shortid  from 'shortid';
import * as _ from 'underscore';

import { CreateItemMessageComponent } from './create-new-item-message/create-new-item-message.component'
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
  
  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
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
    if (this.nombre.errors || this.ci.errors || this.celular.errors || this.personaQueRecibio .errors) {
      this.snackBar.openFromComponent(CreateItemMessageComponent, {
        data: {
          error: 'Verifique los campos requeridos'
        },
        duration: 800,
      });

      return; 
    }

    const itemID = this.item.ci ? `${this.item.ci}`.replace(/\s/g,'').replace('-', '_') : shortid.generate();
    const newItem = _.clone(this.item);

    newItem.pagoEfectivoPersonaQueRecibio = `${this.item['pago-efectivo']} - ${this.item['persona-que-recibio']}`;
    newItem.workshopDiaYHorario = `${this.item['workshop']} / ${this.item['dia-y-horario']}`;

    delete newItem['pago-efectivo'];
    delete newItem['persona-que-recibio'];
    delete newItem['workshop'];
    delete newItem['dia-y-horario'];
    
    this.offlineDatabase.object(`/items/${itemID}`)
      .update(newItem)
      .then(() => {
        console.info('ITEM has been registered');
      })
      .catch();

    this.snackBar.openFromComponent(CreateItemMessageComponent, {
      data: {
        success: 'Asistente Registrado'
      },
      duration: 800,
    });

    this.item = new Item();
    this.nombre.reset();
    this.ci.reset();
    this.celular.reset();
    this.personaQueRecibio.reset();
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
