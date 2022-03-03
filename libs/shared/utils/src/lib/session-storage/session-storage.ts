import { ConstantesStores } from '@rentas/shared/constantes';
import { Casilla, Combo, CurrentData, FactorInteresMoratorio, ListaRepresentantes, TipoCasilla, UserData } from '@rentas/shared/types';
import { ErrorMensajes, PagosPrevios } from '@rentas/shared/types';

export class SessionStorage {

  static getPreDeclaracion<T>(): T {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_PREDECLARACION));
  }

  static setPreDeclaracion(data): void {
    sessionStorage.setItem(ConstantesStores.STORE_PREDECLARACION, JSON.stringify(data));
  }

  static getCodFormulario(): string {
    return SessionStorage.getFormulario<any>().codFormulario;
  }

  static getFormulario<T>(): T {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_FORMULARIO));
  }

  static setFormulario(data): void {
    sessionStorage.setItem(ConstantesStores.STORE_FORMULARIO, JSON.stringify(data));
  }

  static setCurrentData(currentData: CurrentData): void {
    sessionStorage.setItem(ConstantesStores.STORE_CURRENTDATA, JSON.stringify(currentData));
  }

  static getUserData(): UserData {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_USERDATA));
  }

  static setUserData(userData: UserData): void {
    sessionStorage.setItem(ConstantesStores.STORE_USERDATA, JSON.stringify(userData));
  }

  static getToken(): string {
    return sessionStorage.getItem(ConstantesStores.STORE_TOKEN);
  }

  static setToken(token: string) {
    sessionStorage.setItem(ConstantesStores.STORE_TOKEN, token);
  }

  static getrazonSocial(): string {
    return SessionStorage.getUserData().nombreCompleto;
  }

  static getUsuarioSOL(): string {
    return SessionStorage.getUserData().usuarioSOL;
  }

  static getPerTri(): string {
    return SessionStorage.getPreDeclaracion<any>().perTri.toString();
  }

  static getnumRuc(): string {
    return SessionStorage.getUserData().map.ddpData.ddp_numruc;
  }

  static getCombos(): Array<Combo> {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_COMBOS));
  }

  static getCasillas(): Casilla[] {
    return JSON.parse(localStorage.getItem(ConstantesStores.STORE_CASILLAS));
  }

  static setCasillas(casillas: Casilla[]): void {
    localStorage.setItem(ConstantesStores.STORE_CASILLAS, JSON.stringify(casillas));
  }

  static setCombos(combos: Combo[]): void {
    sessionStorage.setItem(ConstantesStores.STORE_COMBOS, JSON.stringify(combos));
  }

  static getErroresInfo(): any[] {
    return JSON.parse(sessionStorage.getItem('SUNAT.listaErroresInformativa'));
  }

  static setErroresInfo(errores: any[]): void {
    sessionStorage.setItem('SUNAT.listaErroresInformativa', JSON.stringify(errores));
  }

  static getErroresDetEstados(): any[] {
    return JSON.parse(sessionStorage.getItem('SUNAT.listaErroresDeterminativaEstados'));
  }

  static setErroresDetEstados(errores: any[]): void {
    sessionStorage.setItem('SUNAT.listaErroresDeterminativaEstados', JSON.stringify(errores));
  }

  static getErroresDet(): any[] {
    return JSON.parse(sessionStorage.getItem('SUNAT.listaErroresDeterminativa'));
  }

  static setErroresDet(errores: any[]): void {
    sessionStorage.setItem('SUNAT.listaErroresDeterminativa', JSON.stringify(errores));
  }

  static getTipoCasillas(): TipoCasilla[] {
    return JSON.parse(localStorage.getItem(ConstantesStores.STORE_TIPO_CASILLAS));
  }

  static setTipoCasillas(listTipoCasilla: TipoCasilla[]): void {
    localStorage.setItem(ConstantesStores.STORE_TIPO_CASILLAS, JSON.stringify(listTipoCasilla));
  }

  static getErrores<T>(): T {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_ERRORES));
  }

  static setErrores(errores: ErrorMensajes[]): void {
    sessionStorage.setItem(ConstantesStores.STORE_ERRORES, JSON.stringify(errores));
  }

  static getAnexo5(): boolean {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_ANEXO5));
  }

  static setAnexo5(valor: boolean): void {
    sessionStorage.setItem(ConstantesStores.STORE_ANEXO5, JSON.stringify(valor));
  }

  static getRepresentantes(): ListaRepresentantes[] {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_REPRESENTANTESLEGALES));
  }

  static setRepresentantes(representantes: ListaRepresentantes[]): void {
    sessionStorage.setItem(ConstantesStores.STORE_REPRESENTANTESLEGALES, JSON.stringify(representantes));
  }

  static getEjercicioAnterior() {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_EJERCICIO_ANTERIOR));
  }

  static setEjercicioAnterior(datos): void {
    sessionStorage.setItem(ConstantesStores.STORE_EJERCICIO_ANTERIOR, JSON.stringify(datos));
  }

  static getValHash() {
    return sessionStorage.getItem(ConstantesStores.STORE_VAL_HASH);
  }

  static setValHash(predeclaracion): void {
    sessionStorage.setItem(ConstantesStores.STORE_VAL_HASH, predeclaracion);
  }

  static setIdentificacionBien(respListaBienes) {
    sessionStorage.setItem(ConstantesStores.STORE_IDENTIFICACION_BIEN, JSON.stringify(respListaBienes));
  }

  static getIdentificacionBien() {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_IDENTIFICACION_BIEN));
  }

  static setFechaServidor(data): void {
    sessionStorage.setItem(ConstantesStores.STORE_FECHA_SERVIDOR, JSON.stringify(data));
  }

  static getFechaServidor() {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_FECHA_SERVIDOR));
  }

  static setCabeceraFormSele(ejercicio) {
    sessionStorage.setItem(ConstantesStores.STORE_CABECERA_FORMULARIO_SELECCIONADO, JSON.stringify(ejercicio));
  }

  static getCabeceraFormSele() {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_CABECERA_FORMULARIO_SELECCIONADO));
  }

  static getErroresBackend(): ErrorMensajes[] {
    return JSON.parse(sessionStorage.getItem('SUNAT.listaErroresBackend'));
  }

  static setErroresBackend(errores: ErrorMensajes[]): void {
    sessionStorage.setItem('SUNAT.listaErroresBackend', JSON.stringify(errores));
  }

  static setPagosPrevios(pagosPrevios: PagosPrevios[]): void {
    sessionStorage.setItem(ConstantesStores.STORE_PAGOS_PREVIOS, JSON.stringify(pagosPrevios));
  }

  static getPagosPrevios(): PagosPrevios[] {
    return JSON.parse(sessionStorage.getItem(ConstantesStores.STORE_PAGOS_PREVIOS));
  }

  static setCasilla107(valor: { casilla107: number, consulto: boolean }): void {
    sessionStorage.setItem('SUNAT.casilla107', JSON.stringify(valor));
  }

  static getCasilla107(): { casilla107: number, consulto: boolean } {
    return JSON.parse(sessionStorage.getItem('SUNAT.casilla107'));
  }

  static getDIreccionIP(): string {
    return sessionStorage.getItem(ConstantesStores.STORE_DIRECCION_IP);
  }

  static setDIreccionIP(ip: string): void {
    sessionStorage.setItem(ConstantesStores.STORE_DIRECCION_IP, ip);
  }

  static setRoute(ruta: string): void {
    sessionStorage.setItem(ConstantesStores.STORE_ROUTE, ruta);
  }

  static getRoute(): string {
    return sessionStorage.getItem(ConstantesStores.STORE_ROUTE);
  }

  static getNumValores(): [] {
    return JSON.parse(sessionStorage.getItem('SUNAT.valores'));
  }

  static setNumValores(valores: []): void {
    sessionStorage.setItem('SUNAT.valores', JSON.stringify(valores));
  }

  static getParametros(): { tributos: [], formularios: [] } {
    return JSON.parse(sessionStorage.getItem('SUNAT.parametros'));
  }

  static setParametros(tributos: [], formularios: []): void {
    const listaParametros = { tributos: tributos, formularios: formularios };
    sessionStorage.setItem('SUNAT.parametros', JSON.stringify(listaParametros));
  }

  static setSociosFichaRuc(socios): void {
    sessionStorage.setItem('SUNAT.sociosFichaRuc', JSON.stringify(socios));
  }

  static getSociosFichaRuc() {
    return JSON.parse(sessionStorage.getItem('SUNAT.sociosFichaRuc'));
  }

  static setFactorInteresMoratorioNatural(factor: FactorInteresMoratorio[]): void {
    sessionStorage.setItem('SUNAT.factorInteres', JSON.stringify(factor));
  }

  static getFactorInteresMoratorioNatural(): FactorInteresMoratorio[] {
    return JSON.parse(sessionStorage.getItem('SUNAT.factorInteres'));
  }

  static setFactorInteresMoratorio(factor: number): void {
    sessionStorage.setItem('SUNAT.factorInteres', JSON.stringify(factor));
  }

  static getFactorInteresMoratorio(): number {
    return JSON.parse(sessionStorage.getItem('SUNAT.factorInteres'));
  }

}