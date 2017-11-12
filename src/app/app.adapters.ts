import { NativeDateAdapter } from '@angular/material';
import { FORMAT_DATE_SHORT } from './app.constants';
import * as moment from 'moment';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    return moment(date).format(FORMAT_DATE_SHORT);
  }
}
