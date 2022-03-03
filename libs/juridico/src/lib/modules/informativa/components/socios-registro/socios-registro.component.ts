import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParsearFormato } from '../../../../utils/ngb-date-parsear-formato';
import { I18n } from '../../../../utils/ngdatepicker/i18n';
import { CustomDatepickerI18n } from '../../../../utils/ngdatepicker/custom-datepicker-i18n';
import { InfPrinAccionistasModel } from '@path/juridico/models/SeccionInformativa/infPrinAccionistasModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Observable, throwError, EMPTY } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { ConstantesSocios } from '@path/juridico/utils/constantesSocios';
import * as moment from 'moment';
import { ConstantesCadenas, ConstantesCombos, ConstantesDocumentos, ConstantesParametros, MensajeGenerales } from '@rentas/shared/constantes';
import { ComboService, ConsultaPersona, ModalConfirmarService } from '@rentas/shared/core';
import { ListaParametro, PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { SociosRegistroFormService } from './socios-registro-form.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

@Component({
  selector: 'app-registro',
  templateUrl: './socios-registro.component.html',
  styleUrls: ['./socios-registro.component.css'],
  providers: [
    SociosRegistroFormService,
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class SociosRegistroComponent implements OnInit {

  @Input() listaSociosInput: InfPrinAccionistasModel[];
  @Output() listaSociosOutput = new EventEmitter<InfPrinAccionistasModel[]>();
  @Input() socio: InfPrinAccionistasModel;
  @Input() indice: number;

  public submitted = false;
  public tipoSocios: ListaParametro[];
  public tipoDocumentos: ListaParametro[];
  private funcionesGenerales = FuncionesGenerales.getInstance();
  private tipoDocumentosObtenidos: ListaParametro[];
  public listaPaises: ListaParametro[];
  public mensaje = MensajeGenerales;
  private porcentaje = 0;
  private completoDataFichaRuc = false;
  public config = createNumberMask({
    allowDecimal: true,
    integerLimit: 3,
    decimalLimit: 8,
    prefix: '',
    suffix: ' %',
    includeThousandsSeparator: false
  });

  constructor(
    public modalService: NgbModal,
    private comboService: ComboService,
    public activeModal: NgbActiveModal,
    private modalMensejaService: ModalConfirmarService,
    public registroSociosForm: SociosRegistroFormService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) { }

  public ngOnInit(): void {
    this.registroSociosForm.getForm.reset();
    this.cargarCombos();
    this.calcularPorcentaje();
    this.registroSociosForm.inicializarFormulario(this.socio);
    this.verificarDocConsolidado();
  }

  private cargarCombos(): void {
    this.tipoSocios = this.comboService.obtenerComboPorNumero(ConstantesCombos.SOCIOS);
    const listaParametros = [ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS, ConstantesDocumentos.RUC,
    ConstantesDocumentos.DNI, ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
    ConstantesDocumentos.PTP, ConstantesDocumentos.CONSOLIDADO, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.tipoDocumentosObtenidos = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);
    this.listaPaises = this.comboService.obtenerComboPorNumero(ConstantesCombos.PAISES);
    this.filtrarParametros();
  }

  private filtrarParametros(): void {
    this.tipoDocumentos = this.tipoDocumentosObtenidos.filter(x => x.val !== ConstantesDocumentos.CONSOLIDADO);
    if (this.listaSociosInput.length < 100 || (this.socio && this.socio.codTipDocSocio !== ConstantesSocios.CONSOLIDADO)) {
      this.tipoSocios = this.tipoSocios.filter(x => x.val !== ConstantesSocios.CONSOLIDADO);
    }
  }

  private calcularPorcentaje(): void {
    this.porcentaje = this.listaSociosInput.reduce((total, socios) => total + Number(socios.porParticipacion), 0);
    this.porcentaje = Number(this.porcentaje.toFixed(8));
  }

  public validarOpcion(): void {
    this.verificarDocConsolidado();
    if (this.socio && !this.socio.codTipDocSocio && !this.completoDataFichaRuc) {
      this.completoDataFichaRuc = true;
      this.flujoDataFichaRuc();
    } else {
      this.flujoNormal();
    }
  }

  private verificarDocConsolidado(): void {
    if (this.registroSociosForm.fieldTipoSocio.value === ConstantesSocios.CONSOLIDADO) {
      this.tipoDocumentos = this.tipoDocumentosObtenidos.filter(x => x.val === ConstantesDocumentos.CONSOLIDADO);
    } else {
      this.tipoDocumentos = this.tipoDocumentosObtenidos.filter(x => x.val !== ConstantesDocumentos.CONSOLIDADO);
    }
  }

  private flujoDataFichaRuc(): void {
    this.registroSociosForm.habilitarCampos();
  }

  private flujoNormal(): void {
    this.registroSociosForm.habilitarCampos();
    this.registroSociosForm.limpiarCampos();
  }

  public tipoDoc(): void {
    this.registroSociosForm.cambiarDoc();
  }

  public obtenerNombre(): void {
    if (this.registroSociosForm.fieldRazSoc.disabled) {
      this.registroSociosForm.fieldRazSoc.setValue(null);
    }
    this.autocompletarNombre()
      .pipe(tap(resp => this.cambiarFechaNacimiento(resp)))
      .subscribe();
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ?
          this.personaService.obtenerPersona(this.registroSociosForm.fieldNroDoc.value)
            .pipe(map(data => this.actualizarNombrePersona(data))) :
          this.personaService.obtenerContribuyente(this.registroSociosForm.fieldNroDoc.value)
            .pipe(map(data => this.actualizarNombreContribuyente(data)))
        ),
        catchError(error => {
          this.spinner.hide();
          switch (this.registroSociosForm.fieldTipoDoc.value) {
            case ConstantesDocumentos.DNI:
              this.registroSociosForm.fieldNroDoc.setErrors({ excepccion01: MensajeGenerales.CUS5_EX02 }); break;
            case ConstantesDocumentos.RUC:
              this.registroSociosForm.fieldNroDoc.setErrors({ excepccion01: MensajeGenerales.CUS5_EX01 }); break;
          }
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.registroSociosForm.fieldNroDoc.errors &&
      (this.registroSociosForm.fieldTipoDoc.value === ConstantesDocumentos.RUC
        || this.registroSociosForm.fieldTipoDoc.value === ConstantesDocumentos.DNI) &&
      this.registroSociosForm.fieldRazSoc.value === null;
  }

  private tipoContribuyente(): Observable<string> {
    if (this.registroSociosForm.fieldNroDoc.value && this.registroSociosForm.fieldTipoDoc.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.registroSociosForm.fieldNroDoc.value && this.registroSociosForm.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private actualizarNombrePersona(data: PersonaNatural): any {
    const nombre = data.desNombrePnat.trim() + ' ' + data.desApepatPnat.trim() + ' ' + data.desApematPnat.trim();
    this.spinner.hide();
    this.registroSociosForm.fieldRazSoc.setValue(nombre);
    return data;
  }

  private actualizarNombreContribuyente(data: PersonaJuridica): any {
    this.spinner.hide();
    this.registroSociosForm.fieldRazSoc.setValue(data.ddpNombre.trim());
    return data;
  }

  private cambiarFechaNacimiento(respuesta: any): void {
    if (respuesta.fecNacPnat) {
      const fechaNaci = moment(respuesta.fecNacPnat);
      const fechaPred = {
        day: Number(fechaNaci.utc().format('DD').toString()),
        month: Number(fechaNaci.utc().format('MM').toString()),
        year: Number(fechaNaci.utc().format('YYYY').toString())
      };
      this.registroSociosForm.fieldFecNac.setValue(fechaPred);
    }
  }

  public metodo(): void {
    this.submitted = true;
    if (this.registroSociosForm.getForm.invalid) return;
    this.autocompletarNombre().subscribe(() => {
      if (!this.socio) {
        this.agregar();
      } else {
        this.actualizar();
      }
    });
  }

  private agregar(): void {

    const socios = {
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      codTipDocSocio: this.registroSociosForm.fieldTipoSocio.value,
      codTipDocPrincipal: this.registroSociosForm.fieldTipoDoc.value,
      numDocPrincipal: this.registroSociosForm.fieldNroDoc.value.toUpperCase(),
      desDocPrincipal: this.registroSociosForm.fieldRazSoc.value.toUpperCase(),
      fecNacPrincipal: this.funcionesGenerales.formatearFechaString(this.registroSociosForm.fieldFecNac.value),
      codPais: this.registroSociosForm.fieldPaisNac.value,
      porParticipacion: this.obtenerPorcentaje(),
      fecConstitucion: this.funcionesGenerales.formatearFechaString(this.registroSociosForm.fieldFecCons.value)
    };

    if (this.existeDocumento() && this.registroSociosForm.fieldTipoSocio.value !== ConstantesSocios.CONSOLIDADO) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX16, 'Mensaje');
    } else if (this.esMayorQueFechaNacimiento()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX17, 'Mensaje');
    } else if (this.consolidadoCon100Porciento()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX07, 'Mensaje');
    } else if (this.documentoNoValido()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX15, 'Mensaje');
    } else if (this.existeConsolidado()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX14, 'Mensaje');
    } else if (this.cantidadMaximadeRegistros()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX12, 'Mensaje');
    } else if (this.exedePorcentajeTotal()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX08, 'Mensaje');
    } else {
      this.listaSociosInput.push(socios);
      this.listaSociosOutput.emit(this.listaSociosInput);
      this.activeModal.close();
    }
  }

  private actualizar(): void {

    const socios = {
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      codTipDocSocio: this.registroSociosForm.fieldTipoSocio.value,
      codTipDocPrincipal: this.registroSociosForm.fieldTipoDoc.value,
      numDocPrincipal: this.registroSociosForm.fieldNroDoc.value.toUpperCase(),
      desDocPrincipal: this.registroSociosForm.fieldRazSoc.value.toUpperCase(),
      fecNacPrincipal: this.funcionesGenerales.formatearFechaString(this.registroSociosForm.fieldFecNac.value),
      codPais: this.registroSociosForm.fieldPaisNac.value,
      porParticipacion: this.obtenerPorcentaje(),
      fecConstitucion: this.funcionesGenerales.formatearFechaString(this.registroSociosForm.fieldFecCons.value)
    };

    if (!this.equals(this.socio, socios)) {
      if (this.existeDocumento()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX16, 'Mensaje');
      } else if (this.esMayorQueFechaNacimiento()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX17, 'Mensaje');
      } else if (this.consolidadoCon100Porciento()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX07, 'Mensaje');
      } else if (this.documentoNoValido()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX15, 'Mensaje');
      } else if (this.existeConsolidado() && this.socio.codTipDocSocio !== ConstantesSocios.CONSOLIDADO) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX14, 'Mensaje');
      } else if (this.actualizarRegistroConsolidado()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX12, 'Mensaje');
      } else if (this.exedePorcentajeTotal()) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS5_EX08, 'Mensaje');
      } else if (this.seEliminaraConsolidado()) {
        this.eliminarConsolidado(socios);
      } else {
        this.listaSociosInput[this.indice] = socios;
        this.listaSociosOutput.emit(this.listaSociosInput);
        this.activeModal.close();
      }
    } else {
      this.activeModal.close();
    }
  }

  private existeDocumento(): boolean {
    return this.listaSociosInput.some(x => {
      return x.numDocPrincipal === this.registroSociosForm.fieldNroDoc.value.toUpperCase() &&
        (this.socio ? x !== this.socio : true);
    });
  }

  private esMayorQueFechaNacimiento(): boolean {
    const listaSocios = [ConstantesSocios.PERSONA_JURICIDA_NO_DOMICILIADO, ConstantesSocios.PERSONA_JURICIDA_DOMICILIADO, ConstantesSocios.CONSOLIDADO]
    if (!listaSocios.includes(this.registroSociosForm.fieldTipoSocio.value)) {
      const fn = this.parseDataMomnet(this.registroSociosForm.fieldFecNac.value);
      const fc = this.parseDataMomnet(this.registroSociosForm.fieldFecCons.value);
      return fn > fc;
    }
    return false;
  }

  private parseDataMomnet(fecha: any) {
    return (fecha?.year ?? '') + (fecha?.month.toString()?.padStart(2, '0') ?? '') + (fecha?.day.toString()?.padStart(2, '0') ?? '');
  }

  private consolidadoCon100Porciento(): boolean {
    return this.registroSociosForm.fieldTipoSocio.value === ConstantesSocios.CONSOLIDADO && Number(this.obtenerPorcentaje()) === 100;
  }

  private documentoNoValido(): boolean {
    return this.registroSociosForm.fieldTipoSocio.value === ConstantesSocios.PERSONA_NATURAL_DOMICILIADO && this.registroSociosForm.fieldTipoDoc.value === ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS
  }

  private existeConsolidado(): boolean {
    const consolidado = this.listaSociosInput.some(x => {
      return x.codTipDocSocio === ConstantesSocios.CONSOLIDADO;
    });
    return consolidado && this.registroSociosForm.fieldTipoSocio.value === ConstantesSocios.CONSOLIDADO;
  }

  private cantidadMaximadeRegistros(): boolean {
    const registrosMaximos = this.registroSociosForm.fieldTipoSocio.value === ConstantesSocios.CONSOLIDADO ? 101 : 100;
    return this.listaSociosInput.filter(x => x.codTipDocSocio !== ConstantesSocios.CONSOLIDADO).length >= registrosMaximos;
  }

  private actualizarRegistroConsolidado() {
    return this.socio.codTipDocSocio === ConstantesSocios.CONSOLIDADO &&
      this.socio.codTipDocSocio !== this.registroSociosForm.fieldTipoSocio.value &&
      this.cantidadMaximadeRegistros();
  }

  private exedePorcentajeTotal(): boolean {
    const porcentajeActual = this.porcentaje;
    const valorAnterior = this.socio ? this.listaSociosInput[this.indice].porParticipacion : 0;
    const porcentajeTotal = (Number(this.obtenerPorcentaje()) + porcentajeActual - Number(valorAnterior)).toFixed(8);

    return Number(porcentajeTotal) > 100.00000000 || Number(porcentajeTotal) > 100;
  }

  private seEliminaraConsolidado(): boolean {
    const consolidado = this.listaSociosInput.some(x => {
      return x.codTipDocSocio === ConstantesSocios.CONSOLIDADO;
    });
    return consolidado && this.registroSociosForm.fieldTipoSocio.value !== ConstantesSocios.CONSOLIDADO && this.socio.codTipDocSocio !== ConstantesSocios.CONSOLIDADO
  }

  private eliminarConsolidado(modelo): void {
    this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeEliminarConsolidado).subscribe($e => {
      if ($e === ConstantesCadenas.RESPUESTA_SI) {
        this.listaSociosInput.splice(100, 1);
        this.listaSociosInput[this.indice] = modelo;
        this.listaSociosOutput.emit(this.listaSociosInput);
        this.activeModal.close();
      }
    });
  }

  private obtenerPorcentaje(): string {
    return String(this.registroSociosForm.fieldPorPar.value).replace(' %', '');
  }

  private equals(obj: InfPrinAccionistasModel, obj2: InfPrinAccionistasModel): boolean {
    return obj2.numFormul === obj.numFormul
      && obj2.codTipDocSocio === obj.codTipDocSocio
      && obj2.codTipDocPrincipal === obj.codTipDocPrincipal
      && obj2.numDocPrincipal === obj.numDocPrincipal
      && obj2.desDocPrincipal === obj.desDocPrincipal
      && obj2.fecNacPrincipal === obj.fecNacPrincipal
      && obj2.codPais === obj.codPais
      && obj2.porParticipacion === obj.porParticipacion
      && obj2.fecConstitucion === obj.fecConstitucion;
  }
}
