import * as moment from 'moment';

export class RegisterItem {
  ci: string;
  nombre: string;
  materialWasDelivered: boolean;
  dateEntries: string[];

  constructor(item: any, materialWasDelivered = false) {
    this.ci = item.ci;
    this.nombre = item.nombre;
    this.materialWasDelivered = materialWasDelivered;
    this.dateEntries = [];
  }
}
