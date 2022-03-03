import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Inft8999DonacionModel } from '@path/juridico/models/SeccionInformativa/inft8999DonacionModel';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ConstantesDonaciones } from '@path/juridico/utils/constantesDonaciones';
import { ConstantesCadenas, ConstantesCasillas, ConstantesCombos, ConstantesDocumentos, MensajeGenerales } from '@rentas/shared/constantes';
import { ComboService, ConsultaPersona, ModalConfirmarService, ValidacionService } from '@rentas/shared/core';
import { ListaParametro, PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { FuncionesGenerales } from '@rentas/shared/utils';
import { CustomDatepickerI18n } from '@path/juridico/utils/ngdatepicker/custom-datepicker-i18n';
import { NgbDateParsearFormato } from '@path/juridico/utils/ngb-date-parsear-formato';
import { I18n } from '@path/juridico/utils/ngdatepicker/i18n';

@Component({
  selector: 'app-idregistro',
  templateUrl: './donaciones-registro.component.html',
  styleUrls: ['./donaciones-registro.component.css'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato }
  ]
})
export class DonacionesRegistroComponent implements OnInit {

  @Input() listaDonacionesInput: Inft8999DonacionModel[];
  @Output() listaDonacionesOutput = new EventEmitter<Inft8999DonacionModel[]>();
  @Input() donacion: Inft8999DonacionModel;
  @Input() indice: number;

  public FORMATO_MONTO = ConstantesCasillas.FORMATO_MONTO;
  public excepciones = MensajeGenerales;
  private funcionesGenerales = FuncionesGenerales.getInstance();
  public registerForm: FormGroup;
  public submitted: boolean;
  private existeData: boolean;
  public tipoDonaciones: ListaParametro[];
  public tipoDocumentos: ListaParametro[];
  public modalidadDonaciones: ListaParametro[];
  private listaModalidadArticulo6: ListaParametro[];
  private listaModalidadExceso: ListaParametro[];
  private listaModalidadArticulo11: ListaParametro[];
  private listaModalidadAlimentos: ListaParametro[];


  private anio: number;
  public max: number;
  public existenCamposVacios = false;

  constructor(
    private comboService: ComboService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private preDeclaracionservice: PreDeclaracionService,
    private modalMensejaService: ModalConfirmarService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.cargarCombos();
    this.anio = Number(this.preDeclaracionservice.obtenerNumeroEjercicio());

    this.registerForm = this.formBuilder.group({
      codTipDonacion: [this.donacion ? this.donacion.codTipDonacion : '', Validators.required],
      codModDonacion: [this.donacion ? this.donacion.codModDonacion : '', Validators.required],
      codTipDocDonat: [this.donacion ? this.donacion.codTipDocDonat : '', Validators.required],
      numDocDonat: [this.donacion ? this.donacion.numDocDonat : '', Validators.required],
      desDocDonat: [this.donacion ? this.donacion.desDocDonat : '', [Validators.required, Validators.pattern(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/)]],
      fecDonacionTxt: [this.obtenerFecha(), Validators.required],
      mtoDonacion: [this.donacion ? this.donacion.mtoDonacion : '', [Validators.required, Validators.min(0.01)]]
    }, {
      validators: [
        ValidacionService.validaNrodoc('codTipDocDonat', 'numDocDonat', 'CUS18'),
        ValidacionService.validarFechas('fecDonacionTxt', this.anio, 'si', 'CUS18'),
      ]
    });

    this.f.codModDonacion.disable();
    this.f.codTipDocDonat.disable();
    this.f.numDocDonat.disable();
    this.f.desDocDonat.disable();
    this.f.fecDonacionTxt.disable();
    this.f.mtoDonacion.disable();

    if (this.donacion) {
      this.existeData = true;
      this.activarCamposActualizar();
    }
  }

  private cargarCombos(): void {
    this.tipoDonaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DONACION);
    const listaModalidadDonaciones = this.comboService.obtenerComboPorNumero(ConstantesCombos.MODALIDAD_DONACION);

    const filtrosArticulo6 = [ConstantesDonaciones.EN_DINERO, ConstantesDonaciones.EN_BIENES, ConstantesDonaciones.EN_SERVICIOS];
    const filtrosExceso = [ConstantesDonaciones.EN_DINERO, ConstantesDonaciones.EN_TITULOS_VALORES, ConstantesDonaciones.EN_BIEN_MUEBLES, ConstantesDonaciones.EN_BIEN_INMUEBLES, ConstantesDonaciones.OTROS]
    const filtrosArticulo11 = [ConstantesDonaciones.EN_SERVICIOS, ConstantesDonaciones.EN_BIENES]
    const filtrosAlimentos = [ConstantesDonaciones.ALIMENTOS, ConstantesDonaciones.GASTOS_NECESARIOS_VINCULADOS];
    this.listaModalidadAlimentos = listaModalidadDonaciones.filter(x => filtrosAlimentos.includes(x.val));
    this.listaModalidadArticulo11 = listaModalidadDonaciones.filter(x => filtrosArticulo11.includes(x.val));
    this.listaModalidadExceso = listaModalidadDonaciones.filter(x => filtrosExceso.includes(x.val));
    this.listaModalidadArticulo6 = listaModalidadDonaciones.filter(x => filtrosArticulo6.includes(x.val));

    const listaParametria = [ConstantesDocumentos.DNI, ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.PASAPORTE,
    ConstantesDocumentos.RUC, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.tipoDocumentos = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametria);
  }

  private activarCamposActualizar(): void {
    if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULO_6) {
      this.tipoDonacionArticulo6(0);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.EXCESO_DE_MECENAZGO || this.f.codTipDonacion.value === ConstantesDonaciones.ENTIDADES_PUBLICAS) {
      this.tipoDonacionArticulo37yExceso(0);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULOS_11) {
      this.tipoDonacionArticulos11(0);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ALIMENTOS_Y_GASTOS) {
      this.tipoDonacionAlimentos(0);
    }
    this.f.numDocDonat.enable();
    if (this.f.codTipDocDonat.value === ConstantesDocumentos.RUC) {
      this.f.desDocDonat.disable();
      this.max = 11;
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.DNI) {
      this.f.desDocDonat.disable();
      this.max = 8;
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.PASAPORTE
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.f.codTipDocDonat.value === ConstantesDocumentos.PTP
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      this.f.desDocDonat.enable();
      this.max = 15;
    }
    this.f.fecDonacionTxt.enable();
    this.f.mtoDonacion.enable();
  }

  private obtenerFecha(): any {
    if (this.donacion) {
      return this.funcionesGenerales.obtenerFechaAlEditar(this.donacion.fecDonacion);
    } else {
      return '';
    }
  }

  public get f() { return this.registerForm.controls; }

  public seleccionarTipoDonacion(): void {
    if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULO_6) {
      this.tipoDonacionArticulo6(1);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.EXCESO_DE_MECENAZGO || this.f.codTipDonacion.value === ConstantesDonaciones.ENTIDADES_PUBLICAS) {
      this.tipoDonacionArticulo37yExceso(1);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULOS_11) {
      this.tipoDonacionArticulos11(1);
    } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ALIMENTOS_Y_GASTOS) {
      this.tipoDonacionAlimentos(1);
    } else {
      this.f.codTipDonacion.setValue('');
      this.f.codModDonacion.setValue('');
      this.f.codModDonacion.disable();
      this.f.codTipDocDonat.setValue('');
      this.f.codTipDocDonat.disable();
    }
    this.seleccionarTipoDocumento();
  }

  private tipoDonacionArticulo6(tipo: number): void {
    if (tipo === 1) {
      this.f.codModDonacion.setValue('');
    }
    this.f.codModDonacion.enable();
    this.f.codTipDocDonat.enable();
    this.f.numDocDonat.disable();
    this.modalidadDonaciones = this.listaModalidadArticulo6;

  }

  private tipoDonacionArticulo37yExceso(tipo: number): void {
    if (tipo === 1) {
      this.f.codModDonacion.setValue('');
    }
    this.f.codModDonacion.enable();
    this.modalidadDonaciones = this.listaModalidadExceso;
    this.f.codTipDocDonat.setValue(ConstantesDocumentos.RUC);
    this.f.codTipDocDonat.disable();
    this.f.numDocDonat.enable();
    this.max = 11;
  }

  private tipoDonacionArticulos11(tipo: number): void {
    if (tipo === 1) {
      this.f.codModDonacion.setValue('');
    }
    this.f.codModDonacion.enable();
    this.modalidadDonaciones = this.listaModalidadArticulo11;
    this.f.codTipDocDonat.setValue(ConstantesDocumentos.RUC);
    this.max = 11;
    this.f.codTipDocDonat.disable();
    this.f.numDocDonat.enable();
  }

  private tipoDonacionAlimentos(tipo: number): void {
    if (tipo === 1) {
      this.f.codModDonacion.setValue('');
    }
    this.f.codModDonacion.enable();
    this.modalidadDonaciones = this.listaModalidadAlimentos;
    this.f.codTipDocDonat.setValue(ConstantesDocumentos.RUC);
    this.max = 11;
    this.f.codTipDocDonat.disable();
    this.f.numDocDonat.enable();
  }

  public seleccionarTipoDocumento(): void {
    this.f.numDocDonat.enable();
    if (!this.existeData) {
      this.f.desDocDonat.setValue('');
    }
    if (this.f.codTipDocDonat.value === ConstantesDocumentos.RUC) {
      this.f.desDocDonat.disable();
      this.max = 11;
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.DNI) {
      this.f.desDocDonat.disable();
      this.max = 8;
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.PASAPORTE
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.f.codTipDocDonat.value === ConstantesDocumentos.PTP
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      this.f.desDocDonat.enable();
      this.max = 15;
    } else {
      this.f.numDocDonat.setValue('');
      this.f.numDocDonat.disable();
      this.f.desDocDonat.setValue('');
      this.f.desDocDonat.disable();
    }
    this.obtenerNombre(0);
  }

  public obtenerNombre(tipo: number): void {
    if (tipo === 1) {
      this.existeData = false;
    }
    if (this.f.numDocDonat.value !== '') {
      if (this.f.desDocDonat.disabled === true && !this.existeData) {
        this.f.desDocDonat.setValue('');
      }
      this.f.fecDonacionTxt.enable();
      this.f.mtoDonacion.enable();
      this.autocompletarNombre().subscribe(() => {
        this.validarCamposVacios();
      });
    } else {
      this.f.desDocDonat.setValue('');
      this.f.fecDonacionTxt.setValue('');
      this.f.mtoDonacion.setValue('');
      this.f.fecDonacionTxt.disable();
      this.f.mtoDonacion.disable();
      this.validarCamposVacios();
    }
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ?
          this.personaService.obtenerPersona(this.f.numDocDonat.value)
            .pipe(map(data => this.actualizarNombrePersona(data))) :
          this.personaService.obtenerContribuyente(this.f.numDocDonat.value)
            .pipe(map(data => this.actualizarNombreContribuyente(data)))
        ),
        catchError(error => {
          this.spinner.hide();
          switch (this.f.codTipDocDonat.value) {
            case ConstantesDocumentos.DNI:
              this.f.numDocDonat.setErrors({ excepccion01: MensajeGenerales.CUS18_EX02 }); break;
            case ConstantesDocumentos.RUC:
              this.f.numDocDonat.setErrors({ excepccion01: MensajeGenerales.CUS18_EX01 }); break;
          }
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private tipoContribuyente(): Observable<string> {
    if (this.f.codTipDocDonat.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private cumpleCondicion(): boolean {
    return !this.f.numDocDonat.errors && !this.existeData &&
      (this.f.codTipDocDonat.value === ConstantesDocumentos.RUC
        || this.f.codTipDocDonat.value === ConstantesDocumentos.DNI) &&
      this.f.desDocDonat.value === '';
  }

  private actualizarNombrePersona(data: PersonaNatural): void {
    this.existeData = true;
    const nombre = data.desNombrePnat.trim() + ' ' + data.desApepatPnat.trim() + ' ' + data.desApematPnat.trim();
    this.spinner.hide();
    this.f.desDocDonat.setValue(nombre);
  }

  private actualizarNombreContribuyente(data: PersonaJuridica): void {
    this.existeData = true;
    this.spinner.hide();
    this.f.desDocDonat.setValue(data.ddpNombre.trim());
  }

  public keyPress(event): void {
    let pattern;
    let inputChar;
    if (this.f.codTipDocDonat.value === ConstantesDocumentos.RUC ||
      this.f.codTipDocDonat.value === ConstantesDocumentos.DNI) {
      pattern = /[0-9]/;
      inputChar = String.fromCharCode(event.charCode);
    } else if (this.f.codTipDocDonat.value === ConstantesDocumentos.PASAPORTE
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_DE_EXTRANJERIA
      || this.f.codTipDocDonat.value === ConstantesDocumentos.PTP
      || this.f.codTipDocDonat.value === ConstantesDocumentos.CARNET_IDENTIDAD) {
      pattern = /[a-zA-Z0-9-ñÑ]/;
      inputChar = String.fromCharCode(event.charCode);
    }
    if (!pattern.test(inputChar) && (event.charCode !== 45) && (event.charCode !== 32) && (event.charCode !== 0)) {
      event.preventDefault();
    }
  }

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      this.agregar();
    });
  }

  private agregar(): void {
    if (this.registerForm.invalid) {
      this.validarCamposVacios();
      return;
    }

    const donaciones = {
      numDonacion: 2,
      codTipDonacion: this.f.codTipDonacion.value,
      codModDonacion: this.f.codModDonacion.value,
      codTipDocDonat: this.f.codTipDocDonat.value,
      numDocDonat: this.f.numDocDonat.value.toUpperCase(),
      desDocDonat: this.f.desDocDonat.value.toUpperCase(),
      fecDonacion: this.funcionesGenerales.formatearFechaString(this.f.fecDonacionTxt.value),
      mtoDonacion: Number(this.f.mtoDonacion.value)
    };

    if (this.donacion) {
      if (!this.equals(this.donacion, donaciones)) {
        this.modalMensejaService.msgActualizarModals('¿Desea actualizar la información?', 'Actualizar Donaciones').subscribe(($e) => {
          if ($e === ConstantesCadenas.RESPUESTA_SI) {
            this.listaDonacionesInput[this.indice] = donaciones;
            this.listaDonacionesOutput.emit(this.listaDonacionesInput);
            this.activeModal.close();
          }
        });
      } else {
        this.activeModal.close();
      }
    } else {
      this.listaDonacionesInput.push(donaciones);
      this.listaDonacionesOutput.emit(this.listaDonacionesInput);

      if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULO_6) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeDonacionArticulo6, 'Mensaje');
      } else if (this.f.codTipDonacion.value === ConstantesDonaciones.EXCESO_DE_MECENAZGO || this.f.codTipDonacion.value === ConstantesDonaciones.ENTIDADES_PUBLICAS) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeDonacionArticulo37, 'Mensaje');
      } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ARTICULOS_11) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeDonacionArticulo11, 'Mensaje');
      } else if (this.f.codTipDonacion.value === ConstantesDonaciones.ALIMENTOS_Y_GASTOS) {
        this.modalMensejaService.msgValidaciones(MensajeGenerales.mensajeDonancionArticulo37Inc, 'Mensaje');
      }
      this.activeModal.close();
    }
  }

  public validarCamposVacios(): void {
    const lista = Object.keys(this.registerForm.value).map(key => ({ type: key, value: this.registerForm.value[key] }));
    this.existenCamposVacios = lista.some(x => {
      return x.value === '' || !x.value;
    });
  }

  private equals(obj: Inft8999DonacionModel, objNuevo: Inft8999DonacionModel): boolean {
    return objNuevo.numDonacion === obj.numDonacion
      && objNuevo.codTipDonacion === obj.codTipDonacion
      && objNuevo.codModDonacion === obj.codModDonacion &&
      objNuevo.codTipDocDonat === obj.codTipDocDonat &&
      objNuevo.numDocDonat === obj.numDocDonat &&
      objNuevo.desDocDonat === obj.desDocDonat &&
      objNuevo.fecDonacion === obj.fecDonacion &&
      Number(objNuevo.mtoDonacion) === Number(obj.mtoDonacion);
  }
}
