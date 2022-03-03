import * as XLSX from 'xlsx';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { ConstantesDocumentos } from '@rentas/shared/constantes'

type AOA = any[][];

export class FuncionesGenerales {

  constructor() { }

  protected static funcionesGenerales: FuncionesGenerales;

  data: AOA = [[1, 2], [3, 4]];

  static getInstance(): FuncionesGenerales {
    if (!this.funcionesGenerales) {
      this.funcionesGenerales = new FuncionesGenerales();
    }
    return this.funcionesGenerales;
  }

  reemplazarParametros(cadena: string, ...parametros: any[]) {
    for (let i = 0; i < parametros.length; i++) {
      cadena = cadena.replace('{' + i + '}', parametros[i]);
    }
    return cadena;
  }

  isNullNumber(input: number) {
    return input == null || input === undefined;
  }

  /**
   * @param valorCasilla refiere a la casilla de la predeclaración
   * puede devolver el valor en numérico de la casilla, de lo contrario devuelve NULL
   */
  opcionalNull(valorCasilla: any) {
    return valorCasilla ? Number(valorCasilla) : (valorCasilla === 0 ? Number(valorCasilla) : null);
  }

  opcionalText(valor: any) {
    return valor ? valor : null;
  }

  /**
   * @param valorCasilla refiere a la casilla de la predeclaración
   * puede devolver el valor en numérico de la casilla, de lo contrario devuelve CERO
   */
  opcionalCero(valorCasilla: any): number {
    return valorCasilla ? Number(valorCasilla) : 0;
  }

  /**
   * @param cantidadDecimales valor de a cuantos decimales se hara el redondeo
   * @param monto monto que sera redondeado
   * @returns retorna el valor redondeado
   */
  redondeo(cantidadDecimales: number, monto: number): number {
    monto = Number((monto).toLocaleString('en-US', { minimumFractionDigits: cantidadDecimales, useGrouping: false }));
    const entero = String(monto).split('.')[0];
    let decimal = String(monto).split('.')[1];
    if (decimal) {
      decimal = decimal.substring(0, cantidadDecimales + 1);
      monto = Number(entero + '.' + decimal);
      cantidadDecimales = Number(String(1).padEnd(cantidadDecimales + 1, '0'));
      return Math.round(Number((monto * cantidadDecimales).toFixed(3))) / cantidadDecimales;
    } else {
      return Number(entero);
    }
  }

  /**
   * @returns retorna las filas del Excel importado
   */
  leerArchivoExcel(event: any): Promise<Array<any>> {
    return new Promise(resolve => {
      /* wire up file reader */
      const target: DataTransfer = (event.target) as DataTransfer;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* leer el libro de trabajo */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* toma la primera hoja */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* guardar data */
        const data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        resolve(data);
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }

  /**
   * @returns retorna un boolean, si es que el archivo cumple con la extension solicitada
   */
  cargoArchivoCorrecto(event: any): boolean {
    if (!!!event) { return false; }
    const file = event.target.files[0].name.split('.').pop().toUpperCase();
    return file === 'XLSX' || file === 'XLS';
  }

  /**
   * @returns retorna el nombre del archivo adjuntado
   */
  getNameArchivo(event: any): string {
    return event.target.files[0].name.toUpperCase();
  }

  /**
   * @returns retorna un boolean, si es que el nombre cumple con el formato
   */
  elNombreCumpleCon(rexp: RegExp, event: any): boolean {
    return rexp.test(this.getNameArchivo(event).split('.')[0]);
  }

  /**
   * @returns regresa un valor boleano si el archio esta adjuntado.
   */
  siAdjuntoArchivo(event: any): boolean {
    return event.target.files.length > 0;
  }

  formatearFechaString(fecha: { year: number, month: number, day: number }): string {
    if (typeof fecha === 'object' && fecha) {
      fecha = {
        day: fecha.day,
        month: fecha.month - 1,
        year: fecha.year
      };
      return moment(fecha).format('YYYY-MM-DD') + 'T00:00:00.000-05:00';
    }
    return null;
  }

  obtenerFechaAlEditar(fecha: string): any {
    if (fecha) {
      return {
        day: Number(fecha.substring(8, 10)),
        month: Number(fecha.substring(5, 7)),
        year: Number(fecha.substring(0, 4))
      };
    } else {
      return '';
    }
  }

  getModalOptions(configExtra: object) {
    return {
      ...configExtra,
      ...{
        backdrop: 'static',
        keyboard: false
      }
    } as object;
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

  public exportarExcel(json: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  public convertirExcelBlob(json: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xls',
      type: 'array',
    });
    return new Blob([excelBuffer], { type: '.xls' }); ;
  }


  opcionalUno(valorCasilla: any) {
    return valorCasilla ? Number(valorCasilla) : (valorCasilla === 0 ? Number(valorCasilla) : 1);
  }

  desHabilitarCampos(campos: Array<any>) {
    return campos.forEach(x => { x.disable(); });
  }

  setearVacioEnCampos(campos: Array<any>) {
    return campos.forEach(x => { x.setValue(''); });
  }

  habilitarCampos(campos: Array<any>) {
    return campos.forEach(x => { x.enable(); });
  }

  readExcel(event: any) {
    return new Promise(resolve => {
      /* wire up file reader */
      const target: DataTransfer = (event.target) as DataTransfer;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* leer el libro de trabajo */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* toma la primera hoja */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* guardar data */
        this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as AOA;
        resolve(this.data);
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }

  formatearPeriodoString(periodo: { year: number, month: number }): string {
    periodo = {
      month: periodo.month - 1,
      year: periodo.year
    };
    return moment(periodo).format('MMYYYY');
  }

  formatearPeriodoFull(periodo: { year: number, month: number }): string {
    periodo = {
      month: periodo.month,
      year: periodo.year
    };
    const mes = String(periodo.month).length === 1 ? '0' + String(periodo.month) : String(periodo.month);
    return String(periodo.year) + mes;
  }

  formatearTributo(tributo: string): string {
    const tributoFormateado = '0' + tributo.substring(0, 3) + '0' + tributo.substring(3);
    return tributoFormateado;
  }

  obtenerPeriodoAlEditar(periodo: string): { month: string, year: string } {
    return {
      month: periodo.substring(0, 2),
      year: periodo.substring(2)
    };
  }

  redondearMontos(monto: number, decimales: number): number {
    const potencia10 = Math.pow(10, decimales);
    return Math.round(Number((monto * potencia10).toFixed(2))) / 100;
  }

  /**
   * LIMITAR EL NUMERO MAXIMO DE DIGITOS PERMITIDOS EN EL NUMERO DE DOCUMENTO DEPENDIENDO DEL TIPO DE DOCUMENTO SELECCIONADO
   * @param codTipDoc CODIGO DEL TIPO DE DOCUMENTO SELECCIONADO
   * @param tipo 1: CUANDO ES UN REGISTRO EN CONDOMINOS O ALQUILERES - SECCION INFORMATIVA, 0: PARA OTRAS CASILLAS CON DETALLES
   */
  maximoDigitosNumeroDocumento(codTipDoc: string, tipo: number): number {
    const codDNI = ConstantesDocumentos.DNI.substring(tipo, 2);
    const codRUC = ConstantesDocumentos.RUC.substring(tipo, 2);
    switch (codTipDoc) {
      case '': return 0;
      case codDNI: return 8;
      case codRUC: return 11;
      default: return 15;
    }
  }
}
