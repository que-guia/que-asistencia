import * as moment from 'moment';
import { FORMAT_DATE_COMPLETE } from '../app.constants';

export class RegisterItem {
  id: String;
  ci: string;
  nombre: string;
  materialWasDelivered: boolean;
  materialDeliveryDate: string;
  dateEntries: string[];

  constructor(item: any, materialWasDelivered = false, materialDeliveryDate = '') {
    this.id = item.id;
    this.ci = item.ci;
    this.nombre = item.nombre;
    this.materialWasDelivered = materialWasDelivered;
    this.materialDeliveryDate = materialDeliveryDate || moment(Date.now()).format(FORMAT_DATE_COMPLETE);
    this.dateEntries = [];
  }
}
