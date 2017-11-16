export class Item {
  id: string;
  recibo: Number;
  coordinador: String;
  fecha: Date;
  fechaRegistro: Date;
  nombre: String;
  ci: String;
  ciudad: String;
  libro: String;
  paquete: String;
  celular: String;
  correo: String;
  libroEntregado: String;
  workshopDiaYHorario: String;
  revClinica: Number;
  revDicas: Number;
  aCuenta: String;
  saldo: String;
  pagoPorWesterUnion: String;
  pagoPorBisaBs: String;
  pagoPorBisaUsd: String;
  pagoPorKhipu: String;
  pagoEfectivoPersonaQueRecibio: String;
  hasProblemWithCI: boolean;
  tipoDePago: string;

  constructor() {
    this.libro = 'NO';
    this.libroEntregado = 'NO';
    this.revClinica = 0;
    this.aCuenta = '0';
    this.saldo = '0';
    this.revDicas = 0;
    this.pagoPorWesterUnion = 'NO';
    this.pagoPorBisaBs = 'NO';
    this.pagoPorBisaUsd = 'NO';
    this.pagoPorKhipu = 'NO';
    this.tipoDePago = 'Efectivo';
  }
}
