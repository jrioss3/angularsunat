import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SatrMantenimientoComponent } from '../mantenimiento/mantenimiento.component';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject, Observable, of, EMPTY, from } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ConstantesSeccionDeterminativa, ConstantesExcepciones } from '@path/natural/utils';
import { ListaParametrosModel, InfAtribucionGastosModel, PreDeclaracionModel } from '@path/natural/models';
import { ParametriaFormulario } from '@path/natural/services';
import { ComboService } from '@rentas/shared/core';
import { Casilla514Cabecera, LCas514Detalle } from '@path/natural/models';
import { switchMap } from 'rxjs/operators';
import { ValidarDeduccionesGastos } from '@path/natural/modules/informativa/components/utils/validar-cas514-alquiler';
import { ConstantesCombos, dtOptionsPN } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-satrmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class SatrMainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = dtOptionsPN;
  private preDeclaracion: PreDeclaracionModel;
  private listaConyugal: InfAtribucionGastosModel[];
  public listAtribRealizadas: InfAtribucionGastosModel[];
  public listAtribRecibidas: InfAtribucionGastosModel[];
  public dtTrigger: Subject<any> = new Subject();
  private listaTipoVinculo: Array<any>;
  private listaTipoDocVinculo: Array<any>;
  private listaTipoDocu: ListaParametrosModel[];
  private listaTipoGasto: Array<any>;
  private lista514: Casilla514Cabecera[];
  private alquiler514: LCas514Detalle[];
  private alquilerTotalS: number;
  private total514: number;
  private listaAlquileresAtribuidos514: any;
  private medicototal = 0;
  private aportacionTotal = 0;
  private hotelTotal = 0;
  private msjRecibido: string;
  private msjEliminar: string;
  private msjRealizado: string;
  private indice: number;
  private funcionesGenerales: FuncionesGenerales;

  constructor(
    private modalService: NgbModal,
    private cus34Service: ParametriaFormulario,
    private comboService: ComboService) { }

  ngOnInit(): void {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.ObtenerListasParametria();
    this.obtenerLista514();
    this.indice = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera.
      findIndex(x => x.indTipoGasto === ConstantesSeccionDeterminativa.COD_TIPO_GASTO_ALQUILERES);
    this.msjRecibido = 'A usted le han atribuido gastos por concepto de Alquileres en la casilla 514. ' +
      'De eliminar la atribución se procederá a eliminar también dichos gastos ¿Desea continuar?';
    this.msjEliminar = '¿Desea eliminar el registro?';
    this.msjRealizado = 'Usted ya ha deducido gastos por concepto de Alquileres en la casilla 514 ¿Desea eliminar los montos deducidos?';
    this.dtTrigger.next();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
  }

  private ObtenerListasParametria(): void {
    this.listaConyugal = this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos;
    this.listAtribRealizadas = this.listaConyugal.filter(x => x.indTipoAtrib === ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA);
    this.listAtribRecibidas = this.listaConyugal.filter(x => x.indTipoAtrib === ConstantesSeccionDeterminativa.COD_ATRIB_RECIBIDA);
    this.listaTipoVinculo = this.cus34Service.obtenerTipoVinculo();
    this.listaTipoDocVinculo = this.cus34Service.obtenerTipoDocumentoVinculo();
    this.listaTipoDocu = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO);
    this.listaTipoGasto = this.cus34Service.ObtenerTipoGasto();
  }

  private obtenerLista514(): void {
    this.lista514 = this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    this.lista514 = ValidarDeduccionesGastos.newInstance(this.lista514).completarRubroGasto();
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera = this.lista514;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.lista514.forEach(x => {
      switch (x.indTipoGasto) {
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_ALQUILERES: {
          this.alquiler514 = x.casilla514Detalle.lisCas514;
          this.alquilerTotalS = Number(x.mtoGasto);
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_MEDICO: {
          this.medicototal = Number(x.mtoGasto);
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_APORTACIONES: {
          this.aportacionTotal = Number(x.mtoGasto);
          break;
        }
        case ConstantesSeccionDeterminativa.COD_TIPO_GASTO_HOTELES: {
          this.hotelTotal = Number(x.mtoGasto);
          break;
        }
      }
    });
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  private rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  public agregar(): void {
    if (this.listAtribRealizadas.length >= 1) {
      this.callModal(ConstantesExcepciones.CUS34_EX15);
    } else if (this.listAtribRecibidas.length >= 1) {
      this.callModal(ConstantesExcepciones.CUS34_EX02);
    } else {
      const modalRef = this.modalService.open(SatrMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
      modalRef.componentInstance.inputListaConyugal = this.listAtribRealizadas;
      modalRef.componentInstance.listaConyugalReady.subscribe(data => {
        this.actualizarGastosPropiosAlquileres(0, data).subscribe();
        this.listAtribRealizadas = data;
        this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos = data.concat(this.listAtribRecibidas);
        SessionStorage.setPreDeclaracion(this.preDeclaracion);
        this.rerender();
      });
    }
  }

  public actualizar(id, index): void {
    const modalRef = this.modalService.open(SatrMantenimientoComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.inputListaConyugal = this.listAtribRealizadas;
    modalRef.componentInstance.inputid = id;
    modalRef.componentInstance.inputidIndex = index;
    modalRef.componentInstance.listaConyugalReady.subscribe(data => {
      this.listAtribRealizadas = data;
      this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos = data.concat(this.listAtribRecibidas);
      SessionStorage.setPreDeclaracion(this.preDeclaracion);
      this.rerender();
    });
  }

  public eliminar(index: number, tipo: number, atribucion: InfAtribucionGastosModel): void {
    switch (tipo) {
      case 1: { // ATRIBUCIONES REALIZADAS
        if (this.listAtribRealizadas.length !== 0) {
          this.quieresEliminarRegistro(2).
            pipe(
              switchMap(resp => resp === 'si' ? this.validarAtribucionesRealizadas() : EMPTY),
              switchMap(bool => bool ? this.quieresEliminarRegistro(0) :
                (this.actualizarGastosPropiosAlquileres(1), this.eliminarAtribucionRealizada(index))),
              switchMap(resp => resp === 'si' ?
                (this.actualizarGastosPropiosAlquileres(1), this.eliminarAtribucionRealizada(index)) : EMPTY)
            ).subscribe();
        }
        break;
      }
      case 2: { // ATRIBUCIONES RECIBIDAS
        this.revisarPagosAtribuidos(atribucion)
        if (this.listaAlquileresAtribuidos514.length > 0) {
          this.quieresEliminarRegistro(1).
            pipe(
              switchMap(resp => resp === 'si' ? this.eliminarRegistrosAtribuidos(index, atribucion) : EMPTY)
            ).subscribe();
        } else {
          this.quieresEliminarRegistro(2).
            subscribe(resp => resp === 'si' ? this.eliminarAtribucionRecibida(index) : EMPTY);
        }
        break;
      }
    }
  }

  private validarAtribucionesRealizadas(): Observable<boolean> {
    return this.alquiler514.length > 0 && this.alquilerTotalS > 0 ? of(true) : of(false);
  }

  private actualizarGastosPropiosAlquileres(valor: number, data?: InfAtribucionGastosModel): Observable<any> {
    this.alquiler514.forEach(x => { // actualiza valores cas514-Alquileres
      x.porAtribucion = valor === 1 ? 0 : 50;
      x.mtoAtribuir = valor === 1 ? Number(((x.mtoComprob * x.porDeduccion) / 100)) :
        Number(((x.mtoComprob * x.porAtribucion * x.porDeduccion) / 10000));
      x.mtoAtribuir = this.funcionesGenerales.redondearMontos(x.mtoAtribuir, 2);
      x.mtoDeduccion = 0;
    });
    this.actualizarAlquileres514();
    return of({});
  }

  private eliminarAtribucionRealizada(index: number): Observable<any> {
    this.listAtribRealizadas.splice(index, 1);
    this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos =
      this.listAtribRealizadas.concat(this.listAtribRecibidas);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.callModal('Se eliminó el elemento correctamente.');
    this.rerender();
    return of({});
  }

  private eliminarRegistrosAtribuidos(index: number, atribucion: InfAtribucionGastosModel): Observable<any> {
    this.eliminarAlquileresAtribuidos(atribucion);
    this.eliminarAtribucionRecibida(index);
    return of({});
  }

  private eliminarAtribucionRecibida(index: number): void {
    this.listAtribRecibidas.splice(index, 1);
    this.preDeclaracion.declaracion.seccInformativa.atribucionesGastos.lisAtribGastos =
      this.listAtribRecibidas.concat(this.listAtribRealizadas);
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
    this.callModal('Se eliminó el elemento correctamente.');
    this.rerender();
  }

  private eliminarAlquileresAtribuidos(atribucion): void {
    this.alquiler514 = [...this.alquiler514].
      filter(x => x.indTipoAtrib === ConstantesSeccionDeterminativa.COD_ATRIB_REALIZADA ||
        (x.indTipoAtrib === ConstantesSeccionDeterminativa.COD_ATRIB_RECIBIDA &&
          (x.numRucTit.length === 11 ? x.numRucTit.substring(2, 10) : x.numRucTit) !== atribucion.numDoc));
    this.actualizarAlquileres514();
  }

  private actualizarAlquileres514(): void {
    this.alquilerTotalS = this.alquiler514.filter(x => String(x.indEstFormVirt) === '1').
      reduce((total, alquileres) => total + Number(alquileres.mtoDeduccion), 0);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].
      casilla514Detalle.lisCas514 = this.alquiler514;
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.casilla514Cabecera.lisCas514Cabecera[this.indice].mtoGasto
      = this.alquilerTotalS;

    this.total514 = this.alquilerTotalS + this.medicototal + this.aportacionTotal + this.hotelTotal; // TOTAL CASILLA 514

    const monto510 = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas510);
    const monto511 = Number(this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas511);
    const calculoDiferencia = monto510 - monto511;
    const valor3UIT = 3 * this.comboService.obtenerUitEjercicioActual();

    const montoTotal514 = Math.min(calculoDiferencia, this.total514, valor3UIT);
    this.preDeclaracion.declaracion.seccDeterminativa.rentaTrabajo.resumenTrabajo.mtoCas514 = montoTotal514;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  private quieresEliminarRegistro(existePago: number): Observable<any> {
    const mensajeEliminar = existePago === 0 ? this.msjRealizado : (existePago === 1 ? this.msjRecibido : this.msjEliminar);
    const modal = {
      titulo: 'Mensaje',
      mensaje: mensajeEliminar
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'Eliminar-Registro';
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  private callModal(excepcionName: string): void {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.modal = modal;
  }

  private revisarPagosAtribuidos(atribucion: InfAtribucionGastosModel): void{
    this.listaAlquileresAtribuidos514 = [...this.alquiler514].
      filter(x => x.indTipoAtrib === ConstantesSeccionDeterminativa.COD_ATRIB_RECIBIDA && (x.numRucTit.length === 11 ? x.numRucTit.substring(2, 10) : x.numRucTit) == atribucion.numDoc);
  }

  public ObtenerDescripcionTipoVinculo(valor: string): string {
    const descTipVin = this.listaTipoVinculo.filter(x => x.val === valor);
    return descTipVin.length !== 0 ? descTipVin[0].desc : '';
  }

  public ObtenerDescripcionTipoDocumentoVinculo(valor: string): string {
    const descTipDocVin = this.listaTipoDocVinculo.filter(x => x.val === valor);
    return descTipDocVin.length !== 0 ? descTipDocVin[0].desc : '';
  }

  public ObtenerDescripcionTipoDocumento(valor: string): string {
    const descTipoDocumento = this.listaTipoDocu.filter(x => x.val === valor);
    return descTipoDocumento.length !== 0 ? descTipoDocumento[0].desc : '';
  }

  public ObtenerDescripcionTipoGasto(valor: string): void {
    const descTipoGasto = this.listaTipoGasto.filter(x => x.val === valor);
    return descTipoGasto.length !== 0 ? descTipoGasto[0].desc : '';
  }
}

