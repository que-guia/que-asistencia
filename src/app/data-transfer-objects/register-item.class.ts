import * as moment from 'moment';
import * as shortid  from 'shortid';
import { FORMAT_DATE_COMPLETE } from '../app.constants';

export class RegisterItem {
  id: String;
  ci: string;
  nombre: string;
  materialWasDelivered: boolean;
  materialDeliveryDate: string;
  dateEntries: string[];

  constructor(item: any, materialDeliveryDate: string = '') {
    this.id = item.id  ? item.id : item.ci ? `${item.ci}`.replace(/\s/g,'').replace('-', '_') : shortid.generate();
    this.ci = item.ci;
    this.nombre = item.nombre;
    this.materialWasDelivered = item.materialWasDelivered;
    this.materialDeliveryDate = materialDeliveryDate || moment(Date.now()).format(FORMAT_DATE_COMPLETE);
    this.dateEntries = [];
  }
}
