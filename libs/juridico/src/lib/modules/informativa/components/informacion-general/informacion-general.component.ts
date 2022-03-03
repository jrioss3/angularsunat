import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError, Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ConstantesCadenas, ConstantesDocumentos, MensajeGenerales } from '@rentas/shared/constantes';
import { ComboService, ConsultaPersona, ValidacionService, CasillaService, ModalConfirmarService } from '@rentas/shared/core';
import { ListaParametro, ListaRepresentantes, PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { FuncionesGenerales, SessionStorage, CasillasUtil } from '@rentas/shared/utils';

@Component({
  selector: 'app-informacion-general',
  templateUrl: './informacion-general.component.html',
  styleUrls: ['./informacion-general.component.css']
})
export class InformacionGeneralComponent extends CasillasUtil implements OnInit {

  public tipoDocumentos: ListaParametro[];
  public tipoDocumentos2: ListaParametro[];
  public registerForm: FormGroup;
  public mensaje: any;
  public submitted = false;
  private funcionesGenerales: FuncionesGenerales;
  private preDeclaracion: PreDeclaracionModel;
  private valor815: string; public casilla815 = this.casillaService.obtenerCasilla('815');
  private valor814: string;
  private valor252: string; public casilla252 = this.casillaService.obtenerCasilla('252');
  private valor253: string;
  private valor254: string;
  private valor255: string;
  private valor256: string;
  private valor257: string;
  private valor258: string; public casilla258 = this.casillaService.obtenerCasilla('258');
  private valor259: string;
  private valor260: string;
  private valor261: string;
  private valor262: string;
  private valor263: string;
  private valor250: string; public casilla250 = this.casillaService.obtenerCasilla('250');
  private valor251: string; public casilla251 = this.casillaService.obtenerCasilla('251');
  private valor817: string; public casilla817 = this.casillaService.obtenerCasilla('817');
  private valor818: string;
  public casilla782 = this.casillaService.obtenerCasilla('782');
  private contador = '1';
  private representante = '2';
  public casilla687 = this.casillaService.obtenerCasilla('687');
  public casilla208 = this.casillaService.obtenerCasilla('208');
  public casilla225 = this.casillaService.obtenerCasilla('225');
  public casilla226 = this.casillaService.obtenerCasilla('226');
  public casilla211 = this.casillaService.obtenerCasilla('211');
  private listaRepresentantes: ListaRepresentantes[];

  constructor(
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private personaService: ConsultaPersona,
    private modalMensejaService: ModalConfirmarService,
    private spinner: NgxSpinnerService,
    private casillaService: CasillaService) {
    super();
  }

  public ngOnInit() {
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    this.listaRepresentantes = SessionStorage.getRepresentantes();
    this.mensaje = MensajeGenerales;
    const listaParametros = [ConstantesDocumentos.DNI, ConstantesDocumentos.RUC, ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.tipoDocumentos = this.comboService.obtenerComboPorNumero(this.casilla687?.codParam ?? '', listaParametros);
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    const valor687 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687);
    const valor208 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas208);
    const valor207 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas207);
    this.valor815 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas815);
    this.valor814 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas814);
    this.valor252 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas252);
    this.valor253 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas253);
    this.valor254 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas254);
    this.valor255 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas255);
    this.valor256 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas256);
    this.valor257 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas257);
    this.valor258 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas258);
    this.valor259 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas259);
    this.valor260 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas260);
    this.valor261 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas261);
    this.valor262 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas262);
    this.valor263 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas263);
    this.valor250 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250);
    this.valor251 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251);
    const valor225 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas225);
    const valor226 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas226);
    this.valor817 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas817);
    this.valor818 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas818);
    const valor211 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas211);
    const valor782 = this.funcionesGenerales.
      opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas782);

    this.filtrarCampos();

    const numero = valor207 ? valor207 : valor208;

    this.registerForm = this.formBuilder.group({
      tipoDocumento: [valor687 ? String(valor687) : '', Validators.required],
      nroDocumento: [numero ? numero : '', Validators.required],
      nombre: [''],
      cpc: [valor211 ? valor211 : '', [
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.maxLength(15)
      ]],
      correo1: [this.valor252 ? this.obtenerCorreoPrincipal() : '', Validators.required],
      correo2: [this.valor258 ? this.obtenerCorreoSecundario() : ''],
      telefono: [this.valor250 ? this.valor250 : ''],
      celular: [this.valor251 ? this.valor251 : '', Validators.pattern(/^[0-9]*$/)],
      tipoDocumento2: [valor225 ? valor225 : ''],
      nroDocumento2: [valor226 ? valor226 : '', Validators.required],
      nombre2: ['', [Validators.required, Validators.pattern(/^[ a-zA-ZñÑ]*$/)]],
      cas782: [valor782 ? valor782 : '0']
    }, {
      validators: [
        ValidacionService.validaNrodoc('tipoDocumento', 'nroDocumento', 'CUS4'),
        ValidacionService.validaNrodoc('tipoDocumento2', 'nroDocumento2', 'CUS4'),
        ValidacionService.validarCel('celular'),
        ValidacionService.validarTelf('telefono'),
        ValidacionService.ValidarEmail('correo1', 'correo2'),
        ValidacionService.ValidarEmail('correo2', 'correo1')
      ]
    });

    this.f.nroDocumento.disable();
    this.f.nombre.disable();

    if (this.f.tipoDocumento.value === ConstantesDocumentos.SIN_DATOS) {
      this.comportamientoCasoSinDoc();
    } else if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI || this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
      this.comportamientoCasoDniRuc();
      this.casilla208.numCas = this.f.tipoDocumento.value === ConstantesDocumentos.DNI ? '207' : '208';
    }

    // Validacion para no permitir que una persona natural registro un representante legal
    const rucPN20 = this.comboService.obtenerComboPorNumero('R06').find(x => x.val === this.preDeclaracion.numRuc);
    const userData = SessionStorage.getUserData().map.ddpData.ddp_tpoemp;

    this.casilla226.indEditable = false;
    this.f.nroDocumento2.disable();
    this.f.nombre2.disable();
    if ((this.preDeclaracion.numRuc.substring(0, 2) === '20' && !rucPN20) || (userData === '05' || userData === '06')) {
      // CASUISTICA DEL REPRESENTANTE LEGAL
      if (this.f.tipoDocumento2.value === ConstantesDocumentos.DNI || this.f.tipoDocumento2.value === ConstantesDocumentos.RUC) {
        this.f.nombre2.disable();
        this.casilla226.indEditable = true;
        this.f.nroDocumento2.enable();
        this.setearNombreRepresentante();
      } else if (this.f.tipoDocumento2.value === ConstantesDocumentos.PASAPORTE ||
        this.f.tipoDocumento2.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
        this.f.tipoDocumento2.value === ConstantesDocumentos.PTP ||
        this.f.tipoDocumento2.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
        this.casilla226.indEditable = true;
        this.f.nroDocumento2.enable();
        this.f.nombre2.enable();
        this.setearNombreRepresentante();
      }
    } else {
      this.f.tipoDocumento2.disable();
      this.f.cas782.disable();
      this.f.tipoDocumento2.setValue('');
      this.f.nroDocumento2.setValue('');
      this.f.cas782.setValue(0);
      this.agregar();
    }
    this.casilla208.indEditable = !this.f.nroDocumento.disabled;
    this.casilla250.indEditable = !this.f.telefono.disabled;
    this.casilla251.indEditable = !this.f.celular.disabled;
  }

  private setearNombreRepresentante(): void {
    if (this.valor817) {
      this.f.nombre2.setValue('');
      this.f.nombre2.setValue(String(this.valor817) + String(this.valor818 ? this.valor818 : ''));
    }
  }

  private filtrarCampos(): void {
    this.tipoDocumentos2 = this.tipoDocumentos;
    this.tipoDocumentos = this.tipoDocumentos.filter(x =>
      x.val === ConstantesDocumentos.DNI ||
      x.val === ConstantesDocumentos.RUC);
    this.tipoDocumentos.push({ desc: 'SIN DATOS', val: ConstantesDocumentos.SIN_DATOS });
  }

  private obtenerCorreoPrincipal(): string {
    return (this.valor252 ? this.valor252 : '') + (this.valor253 ? this.valor253 : '')
      + (this.valor254 ? this.valor254 : '') + (this.valor255 ? this.valor255 : '')
      + (this.valor256 ? this.valor256 : '') + (this.valor257 ? this.valor257 : '');
  }

  private obtenerCorreoSecundario(): string {
    return (this.valor258 ? this.valor258 : '') + (this.valor259 ? this.valor259 : '')
      + (this.valor260 ? this.valor260 : '') + (this.valor261 ? this.valor261 : '')
      + (this.valor262 ? this.valor262 : '') + (this.valor263 ? this.valor263 : '');
  }

  public get f() { return this.registerForm.controls; }

  private comportamientoCasoSinDoc(): void {
    this.f.nombre.setValue('');
    this.casilla208.numCas = '-';
    this.f.nroDocumento.setValue('');
    this.f.nroDocumento.disable();
    this.f.cpc.setValue('');
    this.f.cpc.disable();
    this.f.correo1.setValue('');
    this.f.correo1.disable();
    this.f.correo2.setValue('');
    this.f.correo2.disable();
    this.f.telefono.setValue('');
    this.f.telefono.disable();
    this.f.celular.setValue('');
    this.f.celular.disable();
    this.casilla208.indEditable = !this.f.nroDocumento.disabled;
    this.casilla250.indEditable = !this.f.telefono.disabled;
    this.casilla251.indEditable = !this.f.celular.disabled;
  }

  private comportamientoCasoDniRuc(): void {
    this.submitted = true;
    this.f.nroDocumento.enable();
    this.f.cpc.enable();
    this.f.correo1.enable();
    this.f.correo2.enable();
    this.f.telefono.enable();
    this.f.celular.enable();
    if (this.valor815) {
      this.f.nombre.setValue('');
      this.f.nombre.setValue(String(this.valor815) + String(this.valor814 ? this.valor814 : ''));
    }
    this.casilla208.indEditable = !this.f.nroDocumento.disabled;
    this.casilla250.indEditable = !this.f.telefono.disabled;
    this.casilla251.indEditable = !this.f.celular.disabled;
  }

  private afterChangeDocContadorDniRuc(): void {
    this.f.nroDocumento.enable();
    this.f.nroDocumento.setValue('');
    this.f.nombre.setValue('');
    this.f.cpc.enable();
    this.f.correo1.enable();
    this.f.correo2.enable();
    this.f.telefono.enable();
    this.f.celular.enable();
    this.casilla208.indEditable = !this.f.nroDocumento.disabled;
    this.casilla250.indEditable = !this.f.telefono.disabled;
    this.casilla251.indEditable = !this.f.celular.disabled;
  }

  public validar() {
    if (this.f.nroDocumento.value !== '' && this.f.nombre.value === '') {
      if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI) {
        this.f.nroDocumento.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 });
      } else if (this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
        this.f.nroDocumento.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
      }
    }

    if (this.f.nroDocumento2.value !== '' && this.f.nombre2.value === '') {
      if (this.f.tipoDocumento2.value === ConstantesDocumentos.DNI) {
        this.f.nroDocumento2.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 });
      } else if (this.f.tipoDocumento2.value === ConstantesDocumentos.RUC) {
        this.f.nroDocumento2.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 });
      }
    }
    this.submitted = true;
    if (this.registerForm.invalid) {
      return false;
    }
    return true;
  }

  // Obtener Nombre
  private obtenerNombres(nombre: string): string {
    return nombre !== '' ? nombre.substring(0, 15).toUpperCase() : null;
  }

  // Obtener Apellido
  private obtenerApellidos(apellido: string): string {
    return apellido !== '' ? apellido.substring(15, 30).toUpperCase() : null;
  }

  public agregar(): void {
    // TIPO DOCUMENTO CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas687 =
      this.f.tipoDocumento.value !== '' ? this.f.tipoDocumento.value : null;

    // RUC CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas208 =
      this.f.tipoDocumento.value === ConstantesDocumentos.RUC ?
        (this.f.nroDocumento.value !== '' ? this.f.nroDocumento.value : null) : null;

    // DNI CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas207 =
      this.f.tipoDocumento.value === ConstantesDocumentos.DNI ?
        (this.f.nroDocumento.value !== '' ? this.f.nroDocumento.value : null) : null;

    // APELLIDO CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas815 =
      this.obtenerNombres(this.f.nombre.value);

    // NOMBRE CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas814 =
      this.obtenerApellidos(this.f.nombre.value);

    // CPC CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas211 =
      this.f.cpc.value !== '' ? this.f.cpc.value : null;

    // TELEFONO CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas250 =
      this.f.telefono.value !== '' ? this.f.telefono.value : null;

    // CELULAR CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas251 =
      this.f.celular.value !== '' ? this.f.celular.value : null;

    // CORREO 1 DEL CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas252 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(0, 15) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas253 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(15, 30) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas254 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(30, 45) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas255 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(45, 60) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas256 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(60, 75) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas257 =
      this.f.correo1.value !== '' ? this.f.correo1.value.toUpperCase().substring(75) : null;

    // CORREO 2 DEL CONTADOR
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas258 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(0, 15) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas259 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(15, 30) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas260 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(30, 45) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas261 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(45, 60) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas262 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(60, 75) : null;
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas263 =
      this.f.correo2.value !== '' ? this.f.correo2.value.toUpperCase().substring(75) : null;

    // TIPO DOCUMENTO REPRESENTANTE
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas225 =
      this.f.tipoDocumento2.value !== '' ? this.f.tipoDocumento2.value : null;

    // NUMERO DOCUMENTO REPRESENTANTE
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas226 =
      this.f.tipoDocumento2.value !== '' ?
        (this.f.nroDocumento2.value ? String(this.f.nroDocumento2.value).toUpperCase() : null) : null;

    // APELLIDO REPRESENTANTE
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas817 =
      this.obtenerNombres(this.f.nombre2.value);

    // NOMBRE REPRESENTANTE
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas818 =
      this.obtenerApellidos(this.f.nombre2.value);

    // CONFIRMACION DEL REPRESENTANTE
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas782 = this.f.cas782.value;

    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }

  public changeTipoDocumentoContador() {
    this.f.tipoDocumento.markAsTouched();
    if (this.f.tipoDocumento.value === ConstantesDocumentos.SIN_DATOS) {
      this.modalMensejaService.msgConfirmar(MensajeGenerales.mensajeContador).subscribe(($e) => {
        if ($e === ConstantesCadenas.RESPUESTA_SI) {
          this.comportamientoCasoSinDoc();
          this.agregar();
        } else {
          this.f.tipoDocumento.setValue('');
          this.agregar();
        }
      });
    } else if (this.f.tipoDocumento.value === ConstantesDocumentos.DNI || this.f.tipoDocumento.value === ConstantesDocumentos.RUC) {
      this.afterChangeDocContadorDniRuc();
      this.casilla208.numCas = this.f.tipoDocumento.value === ConstantesDocumentos.DNI ? '207' : '208';
    } else {
      this.casilla208.numCas = '-';
      this.f.nroDocumento.disable();
      this.f.nroDocumento.setValue('');
      this.f.nombre.setValue('');
      this.f.nombre.disable();
      this.f.cpc.enable();
      this.f.correo1.enable();
      this.f.correo2.enable();
      this.f.telefono.enable();
      this.f.celular.enable();
      this.casilla208.indEditable = !this.f.nroDocumento.disabled;
    }
    this.agregar();
  }

  public changeTipoDocumentoRepresentateLegal(): void {
    if (this.f.tipoDocumento2.value === ConstantesDocumentos.DNI || this.f.tipoDocumento2.value === ConstantesDocumentos.RUC) {
      this.f.nombre2.disable();
      this.casilla226.indEditable = true;
      this.f.nroDocumento2.enable();
    } else if (this.f.tipoDocumento2.value === ConstantesDocumentos.PASAPORTE ||
      this.f.tipoDocumento2.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA ||
      this.f.tipoDocumento2.value === ConstantesDocumentos.PTP ||
      this.f.tipoDocumento2.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      this.casilla226.indEditable = true;
      this.f.nroDocumento2.enable();
      this.f.nombre2.enable();
    } else {
      this.casilla226.indEditable = false;
      this.f.nroDocumento2.disable();
      this.f.nombre2.disable();
    }
    this.f.nombre2.setValue('');
    this.f.nroDocumento2.setValue('');
    this.f.cas782.setValue(0);
    this.agregar();
  }

  public obtenerDatosRepresentanteLegal(): void {
    this.f.nombre2.setValue('');
    const tipoDoc = String(this.f.tipoDocumento2.value).length !== 1 ? String(this.f.tipoDocumento2.value).substring(1) : String(this.f.tipoDocumento2.value);
    this.autocompletarNombre(this.representante).subscribe(() => {
      const existeRepresentante = this.listaRepresentantes.some(x => {
        return x.rsoNrodoc.trim() === this.f.nroDocumento2.value.trim() && x.rsoDocide === tipoDoc;
      });
      if (!existeRepresentante && !this.f.nroDocumento2.errors) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS4_EX06, 'Mensaje');
      }
      this.agregar();
    });
  }

  public obtenerDatosContador(): void {
    this.f.nombre.setValue('');
    this.autocompletarNombre(this.contador).subscribe(() => {
      this.agregar();
    });
  }

  private tipoContribuyente(tipoDescripcion: string): Observable<string> {
    if (
      (tipoDescripcion === this.contador ? this.f.tipoDocumento.value : this.f.tipoDocumento2.value) === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (
      (tipoDescripcion === this.contador ? this.f.tipoDocumento.value : this.f.tipoDocumento2.value) === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    }
  }

  private autocompletarNombre(tipoDescripcion: string): Observable<any> {
    if (this.cumpleCondicion(tipoDescripcion)) {
      this.spinner.show();
      return this.tipoContribuyente(tipoDescripcion).pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ?
          this.personaService.obtenerPersona(
            tipoDescripcion === this.contador ? this.f.nroDocumento.value : this.f.nroDocumento2.value
          ).pipe(map(data => this.actualizarNombrePersona(data, tipoDescripcion))) :
          this.personaService.obtenerContribuyente(
            tipoDescripcion === this.contador ? this.f.nroDocumento.value : this.f.nroDocumento2.value
          ).pipe(map(data => this.actualizarNombreContribuyente(data, tipoDescripcion)))
        ),
        catchError(error => {
          this.spinner.hide();
          switch (tipoDescripcion) {
            case this.contador:
              switch (this.f.tipoDocumento.value) {
                case ConstantesDocumentos.DNI:
                  this.f.nroDocumento.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 }); break;
                case ConstantesDocumentos.RUC:
                  this.f.nroDocumento.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 }); break;
              }
              break;
            case this.representante:
              switch (this.f.tipoDocumento2.value) {
                case ConstantesDocumentos.DNI:
                  this.f.nroDocumento2.setErrors({ excepccion01: MensajeGenerales.CUS4_EX02 }); break;
                case ConstantesDocumentos.RUC:
                  this.f.nroDocumento2.setErrors({ excepccion01: MensajeGenerales.CUS4_EX01 }); break;
              }
          }
          this.agregar();
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(tipoDescripcion: string): boolean {
    return tipoDescripcion === this.contador ?
      !this.f.nroDocumento.errors &&
      (this.f.tipoDocumento.value === ConstantesDocumentos.RUC
        || this.f.tipoDocumento.value === ConstantesDocumentos.DNI) &&
      this.f.nombre.value === '' :
      !this.f.nroDocumento2.errors &&
      (this.f.tipoDocumento2.value === ConstantesDocumentos.RUC
        || this.f.tipoDocumento2.value === ConstantesDocumentos.DNI) &&
      this.f.nombre2.value === '';
  }

  private actualizarNombrePersona(data: PersonaNatural, tipoDescripcion: string): void {
    const nombre = data.desApepatPnat.trim() + ' ' + data.desApematPnat.trim() + ' ' + data.desNombrePnat.trim();
    this.spinner.hide();
    tipoDescripcion === this.contador ? this.f.nombre.setValue(nombre) : this.f.nombre2.setValue(nombre);
  }

  private actualizarNombreContribuyente(data: PersonaJuridica, tipoDescripcion: string): void {
    this.spinner.hide();
    tipoDescripcion === this.contador ? this.f.nombre.setValue(data.ddpNombre.trim()) :
      this.f.nombre2.setValue(data.ddpNombre.trim());
  }

  public changecorreo1() {
    this.f.correo2.markAsUntouched();
    this.f.correo2.setValue(this.f.correo2.value);
    this.agregar();
  }

  public changecorreo2() {
    this.f.correo1.markAsUntouched();
    this.f.correo1.setValue(this.f.correo1.value);
    this.agregar();
  }

  public confirmarRepresentante(chkconfirma: any): void {
    this.f.cas782.setValue(chkconfirma.target.checked ? 1 : 0);
    this.agregar();
  }
}
