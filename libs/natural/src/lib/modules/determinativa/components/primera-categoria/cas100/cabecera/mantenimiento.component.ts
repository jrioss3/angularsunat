import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScCas100RegistroComponent } from '../detalle/registro.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@path/natural/components/error-message/validation.service';
import { UtilsComponent } from '@path/natural/components/utils/utils.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ListaParametrosModel, Casilla100Cabecera, LCas100Detalles, PreDeclaracionModel } from '@path/natural/models';
import { ConstantesExcepciones } from '@path/natural/utils';
import { PreDeclaracionService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Observable, throwError, EMPTY } from 'rxjs';
import { switchMap, catchError,tap } from 'rxjs/operators';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { ConstantesCombos, ConstantesDocumentos, dtOptionsPN } from '@rentas/shared/constantes';
import { RenderizarPaginacion, SessionStorage, FuncionesGenerales} from '@rentas/shared/utils';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class ScCas100MantenimientoComponent extends RenderizarPaginacion implements OnInit, AfterViewInit, OnDestroy {

  public mensajeErrorCasilla100 = ConstantesExcepciones;
  public lisCas100Detalles: LCas100Detalles[];
  public registerForm: FormGroup;
  public submitted = false;
  public arrIdentBien: ListaParametrosModel[];
  public arr2IdentBien: ListaParametrosModel[];
  private casilla100Object: Casilla100Cabecera;
  public btnDisableCabecera = false;
  private listaCasilla100: Casilla100Cabecera[];
  public listatipoDoc: ListaParametrosModel[];
  public listTipoBien: ListaParametrosModel[];
  public montoPagoSinInteres: number;
  public max = 0;
  public maxNomRazonSocial = 100;
  public montoGravado: number;
  public dtOptions: DataTables.Settings = dtOptionsPN;
  public dtTrigger: Subject<any> = new Subject();
  public placeholder: string;
  private listaIdenBienAnt: Casilla100Cabecera[];
  private funcionesGenerales: FuncionesGenerales;

  @Output() listaActualizada = new EventEmitter<Casilla100Cabecera[]>();
  @Input() objetoCasilla: Casilla100Cabecera;
  @Input() index: number;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private spinner: NgxSpinnerService,
    private personaService: ConsultaPersona,
    private predeclaracionService: PreDeclaracionService) {
    super();
  }

  ngOnInit(): void {
    this.listaCasilla100 = SessionStorage.getPreDeclaracion<PreDeclaracionModel>()
      .declaracion.seccDeterminativa.rentaPrimera.casilla100Cabecera.lisCas100Cab;
    const rucDeclarante = this.predeclaracionService.obtenerRucPredeclaracion();
    this.placeholder = 'ingresa';
    this.listaIdenBienAnt = SessionStorage.getIdentificacionBien().casilla100;
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.obtenerListasParametria();

    this.registerForm = this.formBuilder.group({
      tipoDocumento: [this.objetoCasilla ? (this.objetoCasilla.codTipDoc ? this.objetoCasilla.codTipDoc : '') : '', Validators.required],
      nroDocumento: [this.objetoCasilla ? this.objetoCasilla.numDoc.trim() : '', [Validators.required]],
      cmbTipoBien: [this.objetoCasilla ? (this.objetoCasilla.codTipBien ? this.objetoCasilla.codTipBien : '') : '', Validators.required],
      cmbIdentBien: [this.objetoCasilla ? (this.objetoCasilla.desBien ? this.objetoCasilla.desBien : '') : '', Validators.required],
      cmbIdentBien2: [this.objetoCasilla ? (this.objetoCasilla.codBien ? this.objetoCasilla.codBien : '') : ''],
      nroPlaca: [this.objetoCasilla ? this.objetoCasilla.numNro : '', Validators.required],
      txtNumPart: [this.objetoCasilla ? this.objetoCasilla.desPartidaReg : '', Validators.pattern(/^[a-zA-Z0-9]*$/)],
      txtRazonSocial: [this.objetoCasilla ? this.objetoCasilla.desRazSoc : '', Validators.pattern(/^[a-zA-Z0-9 ]*$/)]//[a-zA-Z0-9]*$
    }, {
      validators: [
        ValidationService.validarNrodoc('tipoDocumento', 'nroDocumento', 'CUS19', rucDeclarante),
        ValidationService.validaOtrosAlquileresPagados('cmbTipoBien', 'cmbIdentBien', 'nroPlaca'),
      ]
    });

    this.establecerDataAlEditar();
    this.cambiarIdentificacionBien();

    if (this.f.tipoDocumento.value === ConstantesDocumentos.RUC){
      this.f.txtRazonSocial.disable();
    }else if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI){
      this.f.txtRazonSocial.disable();
    }else if(this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_IDENTIDAD ||
      this.f.tipoDocumento.value === ConstantesDocumentos.PTP ||
      this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
      this.f.tipoDocumento.value === ConstantesDocumentos.PASAPORTE) {
      this.f.txtRazonSocial.enable();
    }else{
      this.f.txtRazonSocial.disable();
    }

    if (this.objetoCasilla) {
      this.casilla100Object = this.objetoCasilla;
      this.lisCas100Detalles = this.objetoCasilla.lisCas100Detalles;
      this.montoPagoSinInteres = this.lisCas100Detalles.filter(x => x.indAceptado === '1')
        .reduce((carry, x) => carry + Number(x.mtoPagSInt), 0);
      this.montoGravado = this.lisCas100Detalles.filter(x => x.indAceptado === '1')
        .reduce((carry, x) => carry + Number(x.mtoGravado), 0);
      if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI) {
        this.max = 8;
      } else if (this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
        this.max = 11;
      } else if (this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_IDENTIDAD ||
        this.f.tipoDocumento.value === ConstantesDocumentos.PTP ||
        this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
        this.f.tipoDocumento.value === ConstantesDocumentos.PASAPORTE) {
        this.max = 15;
      }
      if (this.f.cmbTipoBien.value === '02') {
        this.f.cmbIdentBien.disable();
        this.f.cmbIdentBien2.disable();
        this.f.nroPlaca.disable();
        this.placeholder = '';
      }
    } else {
      this.lisCas100Detalles = [];
      this.montoPagoSinInteres = 0;
      this.montoGravado = 0;
    }
  }

  private obtenerListasParametria(): void {
    this.listTipoBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_BIEN);
    this.listTipoBien.forEach(x => { x.val = '0' + x.val; });
    const listaParametros = [ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.RUC, ConstantesDocumentos.DNI,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.listatipoDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);
  }

  public ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public get f() { return this.registerForm.controls; }

  public cambiarTipoDocumento(): void {
   
    this.f.nroDocumento.setValue('');
    this.f.nroDocumento.enable();
    if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI) {
      this.f.txtRazonSocial.setValue('');
      this.f.txtRazonSocial.disable();
      this.max = 8;
    } else if (this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
      this.f.txtRazonSocial.setValue('');
      this.f.txtRazonSocial.disable();
      this.max = 11;
    } else if (this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_IDENTIDAD ||
      this.f.tipoDocumento.value === ConstantesDocumentos.PTP ||
      this.f.tipoDocumento.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
      this.f.tipoDocumento.value === ConstantesDocumentos.PASAPORTE) {
      this.max = 15;
      this.f.txtRazonSocial.setValue('');
      this.f.txtRazonSocial.enable();
    } else {
      this.f.txtRazonSocial.setValue('');
      this.f.txtRazonSocial.disable();
      this.max = 0;
    }
  }

  private establecerDataAlEditar(): void {
    this.arrIdentBien = [];
    this.f.nroPlaca.setValue(this.objetoCasilla ? this.objetoCasilla.numNro : '');
    switch (this.f.cmbTipoBien.value) {
      case '01': this.arrIdentBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES); break;
      case '02': this.arrIdentBien = [{ desc: 'PREDIOS', val: '01' }]; this.f.cmbIdentBien.setValue('01'); break;
      case '03': this.arrIdentBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES); break;
    }
  }

  public cambiarTipoBien(): void {
    switch (this.f.cmbTipoBien.value) {
      case '01': {  // BIEN MUEBLE
        this.arrIdentBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES);
        this.f.cmbIdentBien.setValue('');
        this.f.cmbIdentBien.enable();
        this.f.cmbIdentBien2.enable();
        this.f.nroPlaca.setValue('');
        this.f.nroPlaca.enable();
        this.placeholder = 'ingresar';
        break;
      }
      case '02': {  // BIEN INMUEBLE
        this.arrIdentBien = [{ desc: 'PREDIOS', val: '01' }];
        this.f.cmbIdentBien.setValue('01');
        this.f.cmbIdentBien.disable();
        this.f.cmbIdentBien2.disable();
        this.f.nroPlaca.setValue('');
        this.f.nroPlaca.disable();
        this.placeholder = '';
        break;
      }
      case '03': {  // BIEN INMUEBLE DISTINTO PREDIOS
        this.arrIdentBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES);
        this.f.cmbIdentBien.setValue('');
        this.f.cmbIdentBien.enable();
        this.f.cmbIdentBien2.enable();
        this.f.nroPlaca.setValue('');
        this.f.nroPlaca.enable();
        this.placeholder = 'ingresar';
        break;
      }
      default: {
        this.arrIdentBien = [];
        this.f.cmbIdentBien.setValue('');
        this.f.cmbIdentBien.enable();
        this.f.cmbIdentBien2.setValue('');
        this.f.cmbIdentBien2.enable();
        this.f.nroPlaca.setValue('');
        this.f.nroPlaca.enable();
        this.placeholder = 'ingresar';
      }
    }
  }

  public cambiarIdentificacionBien(): void {
    switch (this.f.cmbTipoBien.value) {
      case '01': {
        switch (this.f.cmbIdentBien.value) {  // BIEN MUEBLE
          case '01': { // VEHICULOS
            this.cargarDataIdenBien(this.f.cmbTipoBien.value, this.f.cmbIdentBien.value);
            break;
          }
          case '04': { // OTROS
            this.cargarDataIdenBien(this.f.cmbTipoBien.value, this.f.cmbIdentBien.value);
            break;
          }
          default: {
            this.arr2IdentBien = [];
            this.f.cmbIdentBien2.setValue('');
          }
        }
        break;
      }
      case '02': { // BIEN INMUEBLE PREDIOS
        if (this.f.cmbIdentBien.value === '01') { // predios
          this.arr2IdentBien = [];
        }
        break;
      }
      case '03': { // BIEN INMUEBLE
        switch (this.f.cmbIdentBien.value) {
          case '01': { // CONCESION MINERA
            this.cargarDataIdenBien(this.f.cmbTipoBien.value, this.f.cmbIdentBien.value);
            break;
          }
          case '02': { // OTROS
            this.cargarDataIdenBien(this.f.cmbTipoBien.value, this.f.cmbIdentBien.value);
            break;
          }
          case '': { // VACIO
            this.arr2IdentBien = [];
            this.f.cmbIdentBien2.setValue('');
            break;
          }
          default: { // NAVES O AERONAVES
            this.cargarDataIdenBien(this.f.cmbTipoBien.value, this.f.cmbIdentBien.value);
            break;
          }
        }
      }
    }
  }

  public seleccionarIdenBien(): void {
    this.f.nroPlaca.setValue(this.f.cmbIdentBien2.value);
  }

  private cargarDataIdenBien(codTipo: string, codSubTipo: string): void {
    this.arr2IdentBien = [];
    const lista = this.listaIdenBienAnt.filter(x => x.codTipBien === codTipo && x.desBien === codSubTipo);
    lista.forEach(x => {
      this.arr2IdentBien.push({ desc: x.numNro, val: x.numNro });
    });
  }

  public obtenerPeriodo(val: string): string {
    return val.substring(0, 2) + '/' + val.substring(2);
  }

  public validarPadron(): void {
    
    this.obtenerNombre();
    this.validarNombreRazonSocial().subscribe(() => this.spinner.hide());
  }

  private validarNombreRazonSocial(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().
        pipe(
          switchMap(this.validarPersona.bind(this)),
          catchError(error => {
            switch (this.f.tipoDocumento.value) {
              case ConstantesDocumentos.DNI:
                this.f.nroDocumento.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX05 });
                break;
              case ConstantesDocumentos.RUC:
                this.f.nroDocumento.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS19_EX03 }); break;
            }
            this.spinner.hide();
            return throwError(error);
            
          })
        );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.f.nroDocumento.errors &&
      (this.f.tipoDocumento.value === ConstantesDocumentos.RUC || this.f.tipoDocumento.value === ConstantesDocumentos.DNI);
  }

  private validarPersona(tipo: string): Observable<PersonaJuridica | PersonaNatural> {
    return tipo === ConstantesDocumentos.DNI ?
      this.personaService.obtenerPersona(this.f.nroDocumento.value) :
      this.personaService.obtenerContribuyente(this.f.nroDocumento.value);
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.nroDocumento.value && this.f.tipoDocumento.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.nroDocumento.value && this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  public metodo(): void {
    this.submitted = true;
    this.validarNombreRazonSocial().subscribe(() => {
      this.spinner.hide();
      this.agregar();
    });
  }

  private agregar(): void {
   
    if (this.registerForm.invalid) {
      return;
    }
    

    this.casilla100Object = {
      codBien: null,
      codTipBien: this.f.cmbTipoBien.value,
      codTipDoc: this.f.tipoDocumento.value,
      codTipVia: null,
      codTipZona: null,
      codUbigeo2: null,
      desBien: this.f.cmbIdentBien.value,
      desPartidaReg: this.f.txtNumPart.value ? this.f.txtNumPart.value.toUpperCase() : null,
      desReferenc: null,
      desVia: null,
      desZona: null,
      indArchPers: null,
      mtoGravado: this.objetoCasilla ? this.objetoCasilla.mtoGravado : 0,
      mtoPagSinInt: this.objetoCasilla ? this.objetoCasilla.mtoPagSinInt : 0,
      numArrend: null,
      numDoc: this.f.nroDocumento.value.toUpperCase(),
      numDpto: null,
      numInterior: null,
      numKilometro: null,
      numLote: null,
      numManzana: null,
      numNro: this.f.nroPlaca.value ? this.f.nroPlaca.value.toUpperCase() : null,
      numSumAgua: null,
      numSumLuz: null,
      lisCas100Detalles: this.objetoCasilla ? this.objetoCasilla.lisCas100Detalles : [],
      desRazSoc : this.f.txtRazonSocial.value ? this.f.txtRazonSocial.value.toUpperCase() : null
    };

    if (!this.objetoCasilla) {
      this.f.tipoDocumento.disable();
      this.f.nroDocumento.disable();
      this.f.cmbTipoBien.disable();
      this.f.cmbIdentBien.disable();
      this.f.cmbIdentBien2.disable();
      this.f.nroPlaca.disable();
      this.f.txtNumPart.disable();
      this.btnDisableCabecera = true;
      this.listaCasilla100.push(this.casilla100Object);
      this.listaActualizada.emit(this.listaCasilla100);
      this.callModal('Proceda a seleccionar los pagos que correspondan al Bien Identificado.');
      this.callModal('Se registró correctamente los Datos de Cabecera.');
    } else if (!this.equals(this.objetoCasilla, this.casilla100Object)) {
      this.listaCasilla100[this.index] = this.casilla100Object;
      this.listaActualizada.emit(this.listaCasilla100);
      this.objetoCasilla = this.casilla100Object;
      this.callModal('Se registró correctamente los Datos de Cabecera.');
    }
  }

  public agregaroActualizar(objeto?: LCas100Detalles, indice?: number): void {
    if (this.btnDisableCabecera || this.objetoCasilla) {
      const modalRef = this.modalService.open(ScCas100RegistroComponent, this.funcionesGenerales.getModalOptions({}));
      modalRef.componentInstance.inputCabecera = this.casilla100Object;
      modalRef.componentInstance.indice = indice;
      modalRef.componentInstance.listaDetalle = objeto;
      modalRef.componentInstance.listaDetalleCasilla100.subscribe(($e) => {
        this.actualizarPredeclaracionCasilla100($e, null);
        this.rerender();
      });
    }
  }

  public eliminar(indice): void {
    this.quieresEliminar().subscribe(resp => {
      if (resp === 'si') {
        this.actualizarPredeclaracionCasilla100(null, indice);
        this.callModal('Se eliminó el elemento correctamente.');
        this.rerender();
      }
    });
  }

  private actualizarPredeclaracionCasilla100(data: Casilla100Cabecera, index: number): void {
    if (data !== null) { this.casilla100Object = data; }
    if (index != null) { this.casilla100Object.lisCas100Detalles.splice(index, 1); }
    this.lisCas100Detalles = this.casilla100Object.lisCas100Detalles;
    this.montoPagoSinInteres = this.lisCas100Detalles
      .filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoPagSInt), 0);
    this.montoGravado = this.lisCas100Detalles
      .filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoGravado), 0);
    this.casilla100Object.mtoGravado = this.montoGravado;
    this.casilla100Object.mtoPagSinInt = this.montoPagoSinInteres;
    this.listaCasilla100[this.index === 0 || this.index !== 0 ? this.index : this.listaCasilla100.length - 1] = this.casilla100Object;
    this.listaActualizada.emit(this.listaCasilla100);
  }

  private quieresEliminar(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: '¿Desea eliminar el registro?'
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

  public checkDetalleRentaPrimera(chkDetalleCas100, indice): void {
    const estadoCheck = chkDetalleCas100.currentTarget.checked;
    if (!estadoCheck) {
      this.montoGravado = this.calculoMontoGravadoUncheck(indice);
      this.montoPagoSinInteres = this.calculoMontoPagoSIUncheck(indice);
      this.casilla100Object.lisCas100Detalles[indice].indAceptado = '0';
    } else {
      this.montoGravado = this.calculoMontoGravadocheck(indice);
      this.montoPagoSinInteres = this.calculoMontoPagoSIcheck(indice);
      this.casilla100Object.lisCas100Detalles[indice].indAceptado = '1';
    }
    this.casilla100Object.mtoGravado = this.montoGravado;
    this.casilla100Object.mtoPagSinInt = this.montoPagoSinInteres;
    this.listaCasilla100[this.index === 0 || this.index !== 0 ? this.index : this.listaCasilla100.length - 1] = this.casilla100Object;
    this.listaActualizada.emit(this.listaCasilla100);
  }

  private calculoMontoGravadoUncheck(indice: number): number {
    return this.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoGravado), 0) -
      this.casilla100Object.lisCas100Detalles[indice].mtoGravado;
  }

  private calculoMontoGravadocheck(indice: number): number {
    return this.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoGravado), 0) +
      this.casilla100Object.lisCas100Detalles[indice].mtoGravado;
  }

  private calculoMontoPagoSIUncheck(indice: number): number {
    return this.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoPagSInt), 0) -
      this.casilla100Object.lisCas100Detalles[indice].mtoPagSInt;
  }

  private calculoMontoPagoSIcheck(indice: number): number {
    return this.lisCas100Detalles.filter(x => x.indAceptado === '1')
      .reduce((carry, x) => carry + Number(x.mtoPagSInt), 0) +
      this.casilla100Object.lisCas100Detalles[indice].mtoPagSInt;
  }

  private equals(obj: Casilla100Cabecera, objNuevo: Casilla100Cabecera) {
    return obj.codTipDoc === objNuevo.codTipDoc &&
      obj.numDoc === objNuevo.numDoc &&
      obj.desPartidaReg === objNuevo.desPartidaReg &&
      obj.numArrend === objNuevo.numArrend &&
      obj.codUbigeo2 === objNuevo.codUbigeo2 &&
      obj.mtoPagSinInt === objNuevo.mtoPagSinInt &&
      obj.mtoGravado === objNuevo.mtoGravado &&
      obj.codTipBien === objNuevo.codTipBien &&
      obj.codBien === objNuevo.codBien &&
      obj.desBien === objNuevo.desBien &&
      obj.codTipVia === objNuevo.codTipVia &&
      obj.desVia === objNuevo.desVia &&
      obj.codTipZona === objNuevo.codTipZona &&
      obj.desZona === objNuevo.desZona &&
      obj.numNro === objNuevo.numNro &&
      obj.numKilometro === objNuevo.numKilometro &&
      obj.numManzana === objNuevo.numManzana &&
      obj.numInterior === objNuevo.numInterior &&
      obj.numDpto === objNuevo.numDpto &&
      obj.numLote === objNuevo.numLote &&
      obj.desReferenc === objNuevo.desReferenc &&
      obj.numSumLuz === objNuevo.numSumLuz &&
      obj.numSumAgua === objNuevo.numSumAgua &&
      obj.indArchPers === objNuevo.indArchPers && 
      obj.desRazSoc === objNuevo.desRazSoc;
  }

  public obtenerNombre(): void {   
    const val = this.f.tipoDocumento.value; 
   
    switch (val){
      case ConstantesDocumentos.RUC:{
        this.f.txtRazonSocial.setValue("");
        this.autocompletarNombreRUC().subscribe(() => {         
          this.spinner.hide();
         
        });
        break;
      }
      case ConstantesDocumentos.DNI:{
        this.f.txtRazonSocial.setValue("");
        this.autocompletarNombreDNI().subscribe(() => {        
          this.spinner.hide();        
        });
        break;
      }      
    }     
  }

  private autocompletarNombreRUC(): Observable<any> {
   
    if (this.cumpleCondicion()) {
      this.spinner.show();
      this.f.txtRazonSocial.setValue("");
      return this.personaService.obtenerContribuyente(this.f.nroDocumento.value).pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)),
        catchError(error => {        
          this.spinner.hide();
          this.f.txtRazonSocial.setValue("");
        
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void{
    this.f.txtRazonSocial.setValue(data.ddpNombre.trim());
    this.spinner.hide();

  }

  private autocompletarNombreDNI(): Observable<any> {
   
    if (this.cumpleCondicion()) {
      this.spinner.show();      
      return this.personaService.obtenerPersona(this.f.nroDocumento.value).pipe(
        tap(data => this.obtenerNombreNatural(data)),
        catchError(error => {
         
          this.spinner.hide();
          this.f.txtRazonSocial.setValue("");
          //this.guardarErrorExistenciaPadron();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerNombreNatural(data: PersonaNatural): void{
    this.f.txtRazonSocial.setValue(data.desNombrePnat.trim() + " " + data.desApepatPnat.trim()+ " " + data.desApematPnat.trim());
    this.spinner.hide();
  }




}
