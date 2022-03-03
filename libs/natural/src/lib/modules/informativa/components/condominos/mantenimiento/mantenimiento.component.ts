import { MostrarMensajeService } from '@path/natural/services/mostrarMensaje.service';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@path/natural/components';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultaPersona, ComboService } from '@rentas/shared/core';
import { of, Observable, throwError, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { PreDeclaracionService } from '@path/natural/services';
import { ConstantesExcepciones, ConstantesMensajesInformativos } from '@path/natural/utils';
import { ListaParametrosModel, InfCondominoModel } from '@path/natural/models';
import { CasillasUtil } from '@rentas/shared/utils';
import { PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { ConstantesCombos, ConstantesDocumentos } from '@rentas/shared/constantes';
import { FuncionesGenerales } from '@rentas/shared/utils';

//import { Subject } from 'rxjs';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class ScMantenimientoComponent extends CasillasUtil implements OnInit {
  @Input() inputListaCondominios: InfCondominoModel[];
  @Output() listaCondominios = new EventEmitter<InfCondominoModel[]>();
  @Input() inputCondominos: InfCondominoModel;
  @Input() inputIndexCondominos: number;

  public registerForm: FormGroup;
  public submitted = false;
  public mensajeExcepcion = ConstantesExcepciones;
  public listaTipoDoc: ListaParametrosModel[];
  private dataPadronRUC: boolean;
  public length: number;
  private codRUC: string;
  private codDNI: string;
  private funcionesGenerales: FuncionesGenerales;
  public anioEjercicio: number;
  public placholder = '';

  //dtTrigger: Subject<any> = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comboService: ComboService,
    private spinner: NgxSpinnerService,
    private personaService: ConsultaPersona,
    private mostrarMensaje: MostrarMensajeService,
    private predeclaracionService: PreDeclaracionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.anioEjercicio = Number(this.predeclaracionService.obtenerAnioEjercicio());
    this.filtrarTipoDocumentos();
    this.funcionesGenerales = FuncionesGenerales.getInstance();

    this.registerForm = this.formBuilder.group({
      cmbTipoDocumento: [this.inputCondominos ? this.inputCondominos.codDocIdeDec : '', Validators.required],
      txtNumDoc: [this.inputCondominos ? this.inputCondominos.numdocIdeDec : '', Validators.required],
      txtPorcentaje: [this.inputCondominos ? this.inputCondominos.porParticipa : '', Validators.required],
      txtPartida: [this.inputCondominos ? (this.inputCondominos.desPartidaReg ? this.inputCondominos.desPartidaReg : '') : '',
      Validators.pattern('^[0-9a-zA-Z]+$')],
      txtValorBien: [this.inputCondominos ? this.inputCondominos.mtoValBien : '', Validators.required],
      txtRazSoc: [this.inputCondominos ? this.inputCondominos.desRazSoc : '', [Validators.pattern(/^[ a-zA-Z0-9]*$/)]]
    },
      {
        validators: [
          ValidationService.validarNrodoc('cmbTipoDocumento', 'txtNumDoc', 'CUS03'),
          ValidationService.validarPorcentaje('txtPorcentaje'),
          ValidationService.soloNumeros('txtValorBien', 'CUS03', '', 'si', '', '', this.anioEjercicio)
        ]
      });

    if (this.inputCondominos) {
      this.establecerValoresAlEditar();

      const val = this.f.cmbTipoDocumento.value;
      switch (val) {
        case ConstantesDocumentos.RUC.substring(1, 2): {
          this.f.txtRazSoc.disable();
          break;
        }
        case ConstantesDocumentos.DNI.substring(1, 2): {
          this.f.txtRazSoc.disable();
          break;
        }
        default: {
          this.f.txtRazSoc.enable();
          break;
        }
      }

    } else {
      this.length = 0;
      this.f.txtRazSoc.disable();
    }

  }

  get f() { return this.registerForm.controls; }

  private filtrarTipoDocumentos(): void {
    this.codRUC = ConstantesDocumentos.RUC.substring(1, 2);
    this.codDNI = ConstantesDocumentos.DNI.substring(1, 2);
    const codPAS = ConstantesDocumentos.PASAPORTE.substring(1, 2);
    const codCEX = ConstantesDocumentos.CARNET_DE_EXTRANJERIA.substring(1, 2);
    const codDoc = [this.codRUC, this.codDNI, codPAS, codCEX, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD];
    this.listaTipoDoc = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO_ESPECIAL, codDoc);
  }

  private establecerValoresAlEditar(): void {
    this.dataPadronRUC = true;
    this.length = this.funcionesGenerales.maximoDigitosNumeroDocumento(this.inputCondominos.codDocIdeDec, 1);
  }

  public validarDocumento(codTipDoc: string): void {
    this.f.txtNumDoc.setValue('');
    this.dataPadronRUC = false;
    this.length = this.funcionesGenerales.maximoDigitosNumeroDocumento(codTipDoc, 1);

    const val = this.f.cmbTipoDocumento.value;

    switch (val) {
      case ConstantesDocumentos.RUC.substring(1, 2): {
        this.f.txtRazSoc.setValue("");
        this.f.txtRazSoc.disable();
        break;
      }
      case ConstantesDocumentos.DNI.substring(1, 2): {
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

  public validarPadron(): void {
    this.dataPadronRUC = false;
    const val = this.f.cmbTipoDocumento.value;
    switch (val) {
      case ConstantesDocumentos.RUC.substring(1, 2): {
        this.autocompletarNombreRUC().subscribe(() => {
          this.dataPadronRUC = true;
          this.spinner.hide();
        });
        break;
      }
      case ConstantesDocumentos.DNI.substring(1, 2): {
        this.autocompletarNombreDNI().subscribe(() => {
          this.dataPadronRUC = true;
          this.spinner.hide();
        });
        break;
      }


    }
    /*this.validarNombreRazonSocial().subscribe(() => {
      this.dataPadronRUC = true;
      this.spinner.hide();
    });*/
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

  private obtenerNombreNatural(data: PersonaNatural): void {
    this.f.txtRazSoc.setValue(data.desNombrePnat.trim() + " " + data.desApepatPnat.trim() + " " + data.desApematPnat.trim());
    //this.txtRazSoc = data.ddpNombre.trim();
    this.spinner.hide();

  }

  private autocompletarNombreRUC(): Observable<any> {
    //debugger;
    //console.log("ERROR --- " + this.f.txtNumDoc.errors)
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

  private obtenerRazonSocialContribuyente(data: PersonaJuridica): void {
    this.f.txtRazSoc.setValue(data.ddpNombre.trim());
    //this.txtRazSoc = data.ddpNombre.trim();
    this.spinner.hide();

  }

  private validarNombreRazonSocial(): Observable<any> {
    if (this.condicion()) {
      this.spinner.show();
      return this.tipoContribuyente()
        .pipe(
          switchMap(this.validarExistenciaContribuyente.bind(this)),
          catchError(error => {
            switch (this.f.cmbTipoDocumento.value) {
              case this.codDNI: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX03 }); break;
              case this.codRUC: this.f.txtNumDoc.setErrors({ '{excepccion01}': ConstantesExcepciones.CUS03_EX02 }); break;
            }
            this.spinner.hide();
            return throwError(error);
          })
        );
    }
    return of({});
  }

  private condicion(): boolean {
    return !this.f.txtNumDoc.errors && !this.dataPadronRUC &&
      (this.f.cmbTipoDocumento.value === this.codRUC || this.f.cmbTipoDocumento.value === this.codDNI);
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
    return tipo === this.codDNI ?
      this.personaService.obtenerPersona(this.f.txtNumDoc.value) : this.personaService.obtenerContribuyente(this.f.txtNumDoc.value);
  }

  public metodo() {
    this.submitted = true;
    this.validarNombreRazonSocial().subscribe(() => {
      this.spinner.hide();
      this.agregarOActualizarRegistro();
    });
  }

  public agregarOActualizarRegistro(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const condominos = {
      codDocIdeDec: this.f.cmbTipoDocumento.value,
      numdocIdeDec: String(this.f.txtNumDoc.value).toUpperCase(),
      desRazSoc: this.f.txtRazSoc.value ? this.f.txtRazSoc.value.toUpperCase() : null,
      porParticipa: this.f.txtPorcentaje.value,
      desPartidaReg: this.f.txtPartida.value !== '' ? String(this.f.txtPartida.value).toUpperCase() : null,
      desDireccion: null,
      codUbigeo: null,
      mtoValBien: Number(this.f.txtValorBien.value)
    };

    if (!this.inputCondominos) {
      this.inputListaCondominios.push(condominos);
      this.listaCondominios.emit(this.inputListaCondominios);
    } else if (!this.equals(this.inputCondominos, condominos)) {
      this.inputListaCondominios[this.inputIndexCondominos] = condominos as InfCondominoModel;
      this.listaCondominios.emit(this.inputListaCondominios);
    }
    this.mostrarMensaje.callModal(ConstantesMensajesInformativos.MSJ_GRABADO_DATOS_EXITOSO);
    this.activeModal.close();
  }

  private equals(obj: InfCondominoModel, objNuevo: InfCondominoModel): boolean {
    return objNuevo.codDocIdeDec === obj.codDocIdeDec &&
      objNuevo.numdocIdeDec === obj.numdocIdeDec &&
      objNuevo.porParticipa === obj.porParticipa &&
      objNuevo.desPartidaReg === obj.desPartidaReg &&
      objNuevo.desDireccion === obj.desDireccion &&
      objNuevo.codUbigeo === obj.codUbigeo &&
      objNuevo.mtoValBien === obj.mtoValBien && 
      objNuevo.desRazSoc === obj.desRazSoc;
  }
}
