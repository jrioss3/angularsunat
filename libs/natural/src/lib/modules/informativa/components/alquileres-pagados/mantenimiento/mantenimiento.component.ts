import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild,AfterViewInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../components/error-message/validation.service';
import { ListaParametrosModel, PreDeclaracionModel, InfAlquileresModel,LCas514Detalle } from '@path/natural/models';
import { ConstantesExcepciones , ConstantesAlquileres } from '@path/natural/utils';
import { switchMap, catchError,tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, of, Observable, throwError } from 'rxjs';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConsultaPersona, ComboService, ModalConfirmarService } from '@rentas/shared/core';
import { ConstantesCombos , ConstantesDocumentos,dtOptionsPN } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales, CasillasUtil } from '@rentas/shared/utils';
import { ConstantesCasilla514 } from '@path/natural/utils/constantesCasilla514';
import { ParametriaFormulario } from '@path/natural/services';

import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class SaMantenimientoComponent extends CasillasUtil implements OnInit,AfterViewInit, OnDestroy  {

  public dtOptions: DataTables.Settings = dtOptionsPN;

  @Input() inputListaAlquileres: InfAlquileresModel[];
  @Output() listaAlquileres = new EventEmitter<InfAlquileresModel[]>();
  @Input() inputid: InfAlquileresModel;
  @Input() inputidIndex: number;

  public registerForm: FormGroup;
  public mensajeArrendador = ConstantesExcepciones;
  public submitted = false;
  public texto = '';
  public tamanio: number;
  private rucDeclarante: any;
  public hide1 = true;
  public hide2 = true;
  public hide3 = true;
  public preDeclaracion: PreDeclaracionModel;
  public listaTipoDoc: ListaParametrosModel[];
  public listaBienInmueble: ListaParametrosModel[];
  public listaBienMueble: ListaParametrosModel[];
  private existeDataPadron: boolean;
  public valorTipoBien: string;
  public valorTipoBien2: string;
  public valorTipoBien3: string;
  public listaTipoBien: ListaParametrosModel[];
  public nuevaListaTipoBien: ListaParametrosModel[];
  public tamanioDocumento: number;
  private codRUC: string;
  private codDNI: string;
  private funcionesGenerales: FuncionesGenerales;
  private readonly mensajeConformidadGuardado = 'Se grabaron los datos exitosamente';
  public placholder = '';
  public disabled: boolean;

  public listaGastosAlquiler: LCas514Detalle[];
  private listaFormaPago: ListaParametrosModel[];
  private listaTipoComprobante: ListaParametrosModel[];

  public error_buscar: string;

  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @Output() montoReturn = new EventEmitter<number>();
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private cus27Service: ParametriaFormulario,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private modalService: ModalConfirmarService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService,
    private mostrarMensaje: MostrarMensajeService) { 
      super();
    }

  ngOnInit() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion();
    this.rucDeclarante = this.preDeclaracion.numRuc;
    this.obtenerListasParametria();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    //this.listaGastosAlquiler = this.getListaGastoAlquiler();
    this.obtenerListas();
    

    this.registerForm = this.formBuilder.group({
      cmbTipoDocumento: [this.inputid ? this.inputid.codDocIdeDec : '', Validators.required],
      txtNumDoc: [this.inputid ? this.inputid.numDocIdeDec : '', Validators.required],
      mesAlquiler: [this.inputid ? this.inputid.numMesesAlq : '', Validators.required],
      options: [this.inputid ? this.inputid.codTipBien : '', Validators.required],
      adicional3: [this.inputid ? this.inputid.desBienAlq : ''],
      cmbBienInmueble: [this.inputid ? this.inputid.codSubTipBien : '', Validators.required],
      valorAlquiler: [this.inputid ? this.inputid.mtoAlquiler : '', Validators.required],
      txtRazSoc: [this.inputid ? this.inputid.desRazSoc : '', [Validators.pattern(/^[a-zA-Z0-9 ]*$/)]]
    }, {
      validator: [ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNumDoc', 'CUS04', this.rucDeclarante),
      ValidationService.validaMesAlquiler('mesAlquiler'),
      ValidationService.validaOtrosAlquileresPagados('options', 'cmbBienInmueble', 'adicional3', 'CUS04'),
      ValidationService.soloNumeros('valorAlquiler', 'CUS04', '', '')
    ]
    });

    
    
    if (this.inputid) {

      //this.f.txtRazSoc.disable();
      this.tamanioDocumento = this.funcionesGenerales.maximoDigitosNumeroDocumento(this.f.cmbTipoDocumento.value, 1);
      this.existeDataPadron = true;
      switch (this.inputid.codTipBien) {
        case ConstantesAlquileres.COD_BIEN_INMUEBLE_PREDIOS: this.rbEditarBienInmueblePredios(); break;
        case ConstantesAlquileres.COD_BIEN_INMUEBLE_DISTINTO_PREDIOS: this.rbEditarBienInmuebleDistintoPredios(this.inputid.codSubTipBien, this.inputid.desBienAlq); break;
        default: this.rbEditarBienMueble(this.inputid.codSubTipBien, this.inputid.desBienAlq); break;
      } 

      this.error_buscar = 'No cuenta con información casilla 514 – Rubro Alquileres para el tipo y número de documento ingresado';

      const val = this.f.cmbTipoDocumento.value;       
      switch (val){
        case ConstantesDocumentos.RUC.substring(1, 2):{
          this.f.txtRazSoc.disable();
          break;
        }
        case ConstantesDocumentos.DNI.substring(1, 2):{
          this.f.txtRazSoc.disable();
          break;
        }
        default: {
          this.f.txtRazSoc.enable();
          break;
        }
      }
    }else{
      this.f.txtRazSoc.disable();
    }
  }

  ngAfterViewInit(): void { this.dtTrigger.next(); }

  ngOnDestroy(): void { this.dtTrigger.unsubscribe(); }

  get f() { return this.registerForm.controls; } 

  private obtenerListasParametria(): void {
    this.obtenerListaTipoDocumento();
    this.listaBienMueble = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES);
    this.listaBienInmueble = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES);
    this.listaTipoBien = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_BIEN);
    this.listaTipoBien.forEach(x => { x.val = '0' + x.val; });
    this.nuevaListaTipoBien = this.listaTipoBien;
  }

  private obtenerListaTipoDocumento(): void {
    this.codRUC = ConstantesDocumentos.RUC.substring(1, 2);
    this.codDNI = ConstantesDocumentos.DNI.substring(1, 2);
    const codPAS = ConstantesDocumentos.PASAPORTE.substring(1, 2);
    const codCEX = ConstantesDocumentos.CARNET_DE_EXTRANJERIA.substring(1, 2);
    const codDoc = [this.codRUC, this.codDNI, codPAS, codCEX, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.listaTipoDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO_ESPECIAL, codDoc);
  }

  public rbBienInmueblePredios(): void {
    this.hide2 = true;
    this.hide3 = true;
    this.hide1 = false;
    this.f.cmbBienInmueble.disable();
    this.f.adicional3.disable();
    this.valorTipoBien = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_INMUEBLE_PREDIOS).val;
   
    this.limpiar();
  }

  public rbBienInmuebleDistintoPredios(): void {
    this.valorTipoBien2 = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_INMUEBLE_DISTINTO_PREDIOS).val;
    this.hide2 = false;
    this.hide3 = true;
    this.hide1 = true;
    this.f.cmbBienInmueble.enable();
    this.f.cmbBienInmueble.setValue('');
    this.f.adicional3.enable();
    this.validarOpcion2();
  }

  public rbBienMueble(): void {
    this.valorTipoBien3 = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_MUEBLE).val;
    this.hide2 = true;
    this.hide3 = false;
    this.hide1 = true;
    this.f.cmbBienInmueble.enable();
    this.f.cmbBienInmueble.setValue('');
    this.f.adicional3.enable();
    this.validarOpcion();
  }

  private rbEditarBienInmueblePredios(): void {
    this.hide2 = true;
    this.hide3 = true;
    this.hide1 = false;
    this.texto = '';
    this.f.cmbBienInmueble.setValue('');
    this.f.adicional3.setValue('');
    this.f.cmbBienInmueble.disable();
    this.f.adicional3.disable();
    this.valorTipoBien = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_INMUEBLE_PREDIOS).val;
    this.f.options.setValue(this.valorTipoBien);
  }

  private rbEditarBienInmuebleDistintoPredios(bien, desc): void {
    this.valorTipoBien2 = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_INMUEBLE_DISTINTO_PREDIOS).val;
    this.hide2 = false;
    this.hide3 = true;
    this.texto = '';
    this.f.cmbBienInmueble.setValue(bien);
    this.f.cmbBienInmueble.enable();
    this.f.adicional3.enable();
    this.validarOpcion2();
    this.f.adicional3.setValue(desc);
    this.f.options.setValue(this.valorTipoBien2);
  }

  private rbEditarBienMueble(bien, desc): void {
    this.valorTipoBien3 = this.nuevaListaTipoBien.find(x => x.val === ConstantesAlquileres.COD_BIEN_MUEBLE).val;
    this.hide2 = true;
    this.hide3 = false;
    this.texto = '';
    this.f.cmbBienInmueble.enable();
    this.f.adicional3.enable();
    this.f.cmbBienInmueble.setValue(bien);
    this.validarOpcion();
    this.f.adicional3.setValue(desc);
    this.f.options.setValue(this.valorTipoBien3);
  }

  public validarOpcion(): void {
    this.texto = '';
    this.f.adicional3.setValue('');
    if (this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_CONCESION_MINERA) {
      this.tamanio = 6;
      this.texto = 'Número de Placa';
    } else if (this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_NAVES) {
      this.tamanio = 25;
      this.texto = '';
    }
  }

  public validarOpcion2(): void {
    this.texto = '';
    this.f.adicional3.setValue('');
    if (this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_CONCESION_MINERA) {
      this.tamanio = 10;
      this.texto = 'Partida Registral';
    } else if (this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_OTROS) {
      this.tamanio = 25;
      this.texto = '';
    } else if (this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_AERONAVES || this.f.cmbBienInmueble.value === ConstantesAlquileres.COD_NAVES) {
      this.tamanio = 10;
      this.texto = 'Matrícula';
    }
  }

  public validarDocumento(): void {
    //this.f.txtNumDoc.setValue('');
    this.existeDataPadron = false;
    this.tamanioDocumento = this.funcionesGenerales.maximoDigitosNumeroDocumento(this.f.cmbTipoDocumento.value, 1);
    const val = this.f.cmbTipoDocumento.value;
    //debugger;    
    switch (val){
      case ConstantesDocumentos.RUC.substring(1, 2):{
        this.f.txtRazSoc.setValue("");
        this.f.txtRazSoc.disable();
        break;
      }
      case ConstantesDocumentos.DNI.substring(1, 2):{
        this.f.txtRazSoc.setValue("");
        this.f.txtRazSoc.disable();
        break;
      }
      default: {
        this.f.txtRazSoc.setValue("");
        this.f.txtRazSoc.enable();
        this.f.txtNumDoc.setValue("");
        break;
      }
    }    
  }
 

  public validarEspacio(val: any): void {
    this.f.txtNumDoc.setValue(val.trim());
  }

  public keyPress(event): void {
    const pattern = /[a-zA-Z0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && (event.charCode !== 45) && (event.charCode !== 32) && (event.charCode !== 0)) {
      event.preventDefault();
    }
  }

  /*public obtenerNombre(): void {
    this.existeDataPadron = false;
    this.autocompletarNombre().subscribe(() => {
      this.existeDataPadron = true;
      this.spinner.hide();
    });
  }*/

  public obtenerNombre(): void {
    this.existeDataPadron = false;
    const val = this.f.cmbTipoDocumento.value; 
    switch (val){
      case ConstantesDocumentos.RUC.substring(1, 2):{
        this.autocompletarNombreRUC().subscribe(() => {
          this.existeDataPadron = true;
          this.spinner.hide();
        });
        break;
      }
      case ConstantesDocumentos.DNI.substring(1, 2):{
        this.autocompletarNombreDNI().subscribe(() => {
          this.existeDataPadron = true;
          this.spinner.hide();
        });
        break;
      }

      
    }
     
  }

  private autocompletarNombre(): Observable<any> {
    if (this.condicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(this.validarExistenciaContribuyente.bind(this)),
        catchError(error => {
          switch (this.f.cmbTipoDocumento.value) {
            case this.codDNI: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX03 }); break;
            case this.codRUC: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX02 }); break;
          }
          this.spinner.hide();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private autocompletarNombreDNI(): Observable<any> {
    if (this.condicion()) {
      this.spinner.show();
      return this.personaService.obtenerPersona(this.f.txtNumDoc.value).pipe(
        tap(data => this.obtenerNombreNatural(data)),
        catchError(error => {
          this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX03 });
          this.spinner.hide();
          this.f.txtRazSoc.setValue("");
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerNombreNatural(data: PersonaNatural): void{
    this.f.txtRazSoc.setValue(data.desNombrePnat.trim() + " " + data.desApepatPnat.trim()+ " " + data.desApematPnat.trim());
    //this.txtRazSoc = data.ddpNombre.trim();
    this.spinner.hide();

  }

  

  private autocompletarNombreRUC(): Observable<any> {
    
    if (this.condicion()) {
      this.spinner.show();
      return this.personaService.obtenerContribuyente(this.f.txtNumDoc.value).pipe(
        tap(data => this.obtenerRazonSocialContribuyente(data)),
        catchError(error => {
          this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS04_EX02 });
          this.spinner.hide();
          this.f.txtRazSoc.setValue("");
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void{
    this.f.txtRazSoc.setValue(data.ddpNombre.trim());
    //this.txtRazSoc = data.ddpNombre.trim();
    this.spinner.hide();

  }

  private condicion(): boolean {
    //debugger;
    return !this.f.txtNumDoc.errors && (this.f.cmbTipoDocumento.value === this.codRUC || this.f.cmbTipoDocumento.value === this.codDNI) && !this.existeDataPadron;
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === this.codDNI) {
      return of(this.codDNI);
    } else if (this.f.txtNumDoc.value && this.f.cmbTipoDocumento.value === this.codRUC) {
      return of(this.codRUC);
    } else {
      return EMPTY;
    }
  }

  private validarExistenciaContribuyente(tipo: string): Observable<PersonaNatural | PersonaJuridica> {
   
    return tipo === this.codDNI ? this.personaService.obtenerPersona(this.f.txtNumDoc.value) : this.personaService.obtenerContribuyente(this.f.txtNumDoc.value);
  }

  public metodo(): void {
    this.submitted = true;
    const val = this.f.cmbTipoDocumento.value;
    switch (val){
      case ConstantesDocumentos.RUC.substring(1, 2):{
        this.autocompletarNombreRUC().subscribe(() => {
          this.agregar();
        });
        break;
      }
      case ConstantesDocumentos.DNI.substring(1, 2):{
        this.autocompletarNombreDNI().subscribe(() => {
          this.agregar();
        });
        break;
      }
      default: {
        this.autocompletarNombre().subscribe(() => {
          this.agregar();
        });
        break;
      }


    }
    
  }

  private agregar(): void {
    //debugger;
    let correlativo: number;

    if (this.registerForm.invalid) {
      return;
    }

    correlativo = this.inputListaAlquileres.length !== 0 ?
      [... this.inputListaAlquileres].pop().numCorrPredio + 1 : 1;

    const alquileres = {
      numCorrPredio: !this.inputid ? correlativo : this.inputid.numCorrPredio,
      codDocIdeDec: this.f.cmbTipoDocumento.value,
      numDocIdeDec: this.f.txtNumDoc.value.toUpperCase(),
      mtoAlquiler: Number(this.f.valorAlquiler.value),
      numMesesAlq: this.f.mesAlquiler.value,
      codTipBien: this.f.options.value,
      codSubTipBien: this.f.cmbBienInmueble.value,
      desBienAlq: this.f.adicional3.value == null ? null : this.f.adicional3.value.toUpperCase() ,
      codTipVia: null,
      desVia: null,
      codTipZona: null,
      desZona: null,
      numNro: null,
      numKilometro: null,
      numManzana: null,
      numInterior: null,
      numDpto: null,
      numLote: null,
      desReferenc: null,
      codUbigeo: null,
      desRazSoc: this.f.txtRazSoc.value ? this.f.txtRazSoc.value.toUpperCase() : null
    };

    if (!this.inputid) {
      this.inputListaAlquileres.push(alquileres);
      this.listaAlquileres.emit(this.inputListaAlquileres);
    } else if (this.inputid && !this.equals(this.inputid, alquileres)) {
      this.inputListaAlquileres[this.inputidIndex] = alquileres;
      this.listaAlquileres.emit(this.inputListaAlquileres);
    }

    this.mostrarMensaje.callModal(this.mensajeConformidadGuardado);
    this.activeModal.close();
  }

  private equals(obj: InfAlquileresModel, objNuevo: InfAlquileresModel): boolean {
    return objNuevo.numCorrPredio === obj.numCorrPredio &&
      objNuevo.codDocIdeDec === obj.codDocIdeDec &&
      objNuevo.numDocIdeDec === obj.numDocIdeDec &&
      objNuevo.mtoAlquiler === obj.mtoAlquiler &&
      objNuevo.codTipBien === obj.codTipBien &&
      objNuevo.codSubTipBien === obj.codSubTipBien &&
      objNuevo.desBienAlq === obj.desBienAlq &&
      objNuevo.codTipVia === obj.codTipVia &&
      objNuevo.desVia === obj.desVia &&
      objNuevo.codTipZona === obj.codTipZona &&
      objNuevo.desZona === obj.desZona &&
      objNuevo.numNro === obj.numNro &&
      objNuevo.numKilometro === obj.numKilometro &&
      objNuevo.numManzana === obj.numManzana &&
      objNuevo.numInterior === obj.numInterior &&
      objNuevo.numDpto === obj.numDpto &&
      objNuevo.numLote === obj.numLote &&
      objNuevo.desReferenc === obj.desReferenc &&
      objNuevo.codUbigeo === obj.codUbigeo &&
      objNuevo.numMesesAlq === obj.numMesesAlq && 
      objNuevo.desRazSoc === obj.desRazSoc;
  }

  public buscar(): void{

    //this.spinner.show();
    const lista = this.getListaGastoAlquiler().filter(e => e.numDocEmisor === this.f.txtNumDoc.value);
    if (lista.length === 0) {
      this.error_buscar = 'No cuenta con información casilla 514 – Rubro Alquileres para el tipo y número de documento ingresado';
      this.modalService.msgValidaciones('No cuenta con información casilla 514 – Rubro Alquileres para el tipo y número de documento ingresado', 'Mensaje');
      this.listaGastosAlquiler = lista,this.rerender();
      return;
    }else{
      this.listaGastosAlquiler = lista,this.rerender();
    }

  }

  private getListaGastoAlquiler(): LCas514Detalle[] {
    const listasCasilla514 = this.preDeclaracion.declaracion.seccDeterminativa
      .rentaTrabajo.casilla514Cabecera.lisCas514Cabecera;
    const listaAlquiler = listasCasilla514.find(
      (lista: any) =>
        lista.indTipoGasto === ConstantesCasilla514.COD_TIPO_GASTO_ALQUILER
    );
    return listaAlquiler.casilla514Detalle.lisCas514;  
  }

  public ObtenerTipBien(val: string): string {
    const descTipoBien = this.listaTipoBien.filter(x => x.val === val);
    return descTipoBien.length !== 0 ? descTipoBien[0].desc : '';
  }

  public ObtenerMedPag(val: string): string {
    const descFormaPago = this.listaFormaPago.filter(x => x.val === val);
    return descFormaPago.length !== 0 ? descFormaPago[0].desc : '';
  }

  public ObtenerComprobante(val: string): string {
    const descTipoComprobante = this.listaTipoComprobante.filter(x => x.val === val);
    return descTipoComprobante.length !== 0 ? descTipoComprobante[0].desc : '';
  }

  private obtenerListas(): void {
    //this.listaTipoVinculo = this.cus27Service.obtenerTipoVinculo();
    this.listaFormaPago = this.cus27Service.obtenerFormaPago();
    //this.obtenerListaTipoBien();
    this.listaTipoComprobante = this.cus27Service.obtenerTipoComprobante_cus27();
  }

  public limpiar(): void {    
    this.listaGastosAlquiler = [];
    this.rerender();
  }

  rerender(): void { 
  if (this.dtElement.dtInstance) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let paginaActual = dtInstance.page.info().page;
      const paginasActuales = dtInstance.page.info().pages;
      dtInstance.destroy();
      this.dtTrigger.next();
      this.dtElement.dtInstance.then((dtInstanceNueva: DataTables.Api) => {
        const paginasAhora = dtInstanceNueva.page.info().pages;
        const pagina = paginaActual + 1;
        let esLaUltimaPagina = false;
        if (paginasActuales === pagina) {
          esLaUltimaPagina = true;
        }
        if (esLaUltimaPagina) {
          if (pagina > paginasAhora) {
            paginaActual = paginaActual - 1;
          }
        }
        for (let index = 0; index < 10; index++) {
          dtInstanceNueva.draw(false).page(paginaActual);
        }
      });
    });
  }
}


}
