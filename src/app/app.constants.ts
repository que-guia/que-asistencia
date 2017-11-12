export const FORMAT_DATE_COMPLETE = 'DD/MM/YYYY HH:mm';
export const FORMAT_DATE_SHORT = 'DD/MM/YYYY';

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
}
