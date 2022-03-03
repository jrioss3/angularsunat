import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfAlquileresModel } from '@path/juridico/models/SeccionInformativa/infAlquileresModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, catchError, map } from 'rxjs/operators';
import { throwError, Observable, of, EMPTY } from 'rxjs';
import { ConstantesBienes, ConstantesCombos, ConstantesDocumentos, MensajeGenerales } from '@rentas/shared/constantes';
import { ComboService, ConsultaPersona } from '@rentas/shared/core';
import { ListaParametro, PersonaJuridica, PersonaNatural } from '@rentas/shared/types';
import { CasillasUtil } from '@rentas/shared/utils';
import { AlquileresRegistroFormService } from './alquileres-registro-form.service';

@Component({
  selector: 'app-registro',
  templateUrl: './alquileres-registro.component.html',
  styleUrls: ['./alquileres-registro.component.css'],
  providers: [AlquileresRegistroFormService]
})
export class AlquileresRegistroComponent extends CasillasUtil implements OnInit {

  @Input() listaAlquileresInput: InfAlquileresModel[];
  @Output() listaAlquileresOutput = new EventEmitter<InfAlquileresModel[]>();
  @Input() alquiler: InfAlquileresModel;

  public mensaje = MensajeGenerales;
  public tipoDocumentos: ListaParametro[];
  public BIEN_MUEBLE = ConstantesBienes.BIEN_MUEBLE;
  public BIEN_INMUEBLE = ConstantesBienes.BIEN_INMUEBLE;
  public BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS = ConstantesBienes.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS;

  public submitted = false;

  private bienMuebles: ListaParametro[];
  private bienInmueblesDistPre: ListaParametro[];
  public listaBienMuebles: ListaParametro[] = [];
  public texto = '';

  constructor(
    public activeModal: NgbActiveModal,
    private comboService: ComboService,
    public registroAlquileresForm: AlquileresRegistroFormService,
    private personaService: ConsultaPersona,
    private spinner: NgxSpinnerService) {
    super();
  }

  public ngOnInit(): void {
    this.registroAlquileresForm.getForm.reset();
    this.registroAlquileresForm.inicializarFormulario(this.alquiler);
    this.texto = this.registroAlquileresForm.obtenerDescripcion();
    this.cargarCombos();
  }

  private cargarCombos(): void {
    const listaParametros = [ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS, ConstantesDocumentos.RUC, ConstantesDocumentos.DNI,
    ConstantesDocumentos.CARNET_DE_EXTRANJERIA, ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP,
    ConstantesDocumentos.CARNET_IDENTIDAD];
    this.tipoDocumentos = this.comboService.obtenerComboPorNumero(ConstantesCombos.TIPO_DOCUMENTO, listaParametros);
    this.bienMuebles = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_MUEBLES);
    this.bienInmueblesDistPre = this.comboService.obtenerComboPorNumero(ConstantesCombos.BIEN_INMUEBLES);
    this.listaBienMuebles = this.registroAlquileresForm.comboInicial() ? this.bienMuebles : this.bienInmueblesDistPre;
  }

  public tipoDoc(): void {
    this.registroAlquileresForm.habilitarCamposTipoDoc();
    this.registroAlquileresForm.limpiarCamposDoc();
  }

  public keyPress(event): void {
    const listaDocSecundarios = [ConstantesDocumentos.OTROS_TIPOS_DE_DOCUMENTOS, ConstantesDocumentos.CARNET_DE_EXTRANJERIA,
    ConstantesDocumentos.PASAPORTE, ConstantesDocumentos.PTP, ConstantesDocumentos.CARNET_IDENTIDAD]
    let pattern;
    let inputChar;
    if (this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.RUC ||
      this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.DNI) {
      pattern = /[0-9]/;
      inputChar = String.fromCharCode(event.charCode);
    } else if (listaDocSecundarios.includes(this.registroAlquileresForm.fieldTipoDoc.value)) {
      pattern = /[a-zA-Z0-9-ñÑ]/;
      inputChar = String.fromCharCode(event.charCode);
    }
    if (!pattern.test(inputChar) && (event.charCode !== 45) && (event.charCode !== 32) && (event.charCode !== 0)) {
      event.preventDefault();
    }
  }

  public obtenerNombre(): void {
    if (this.registroAlquileresForm.fieldRazSoc.disabled) {
      this.registroAlquileresForm.fieldRazSoc.setValue(null);
    }
    this.autocompletarNombre().subscribe();
  }

  private autocompletarNombre(): Observable<any> {
    if (this.cumpleCondicion()) {
      this.spinner.show();
      return this.tipoContribuyente().pipe(
        switchMap(tipo => tipo === ConstantesDocumentos.DNI ?
          this.personaService.obtenerPersona(this.registroAlquileresForm.fieldNroDoc.value)
            .pipe(map(data => this.actualizarNombrePersona(data))) :
          this.personaService.obtenerContribuyente(this.registroAlquileresForm.fieldNroDoc.value)
            .pipe(map(data => this.actualizarNombreContribuyente(data)))
        ),
        catchError(error => {
          this.spinner.hide();
          switch (this.registroAlquileresForm.fieldTipoDoc.value) {
            case ConstantesDocumentos.DNI:
              this.registroAlquileresForm.fieldNroDoc.setErrors({ excepccion01: MensajeGenerales.CUS6_EX02 }); break;
            case ConstantesDocumentos.RUC:
              this.registroAlquileresForm.fieldNroDoc.setErrors({ excepccion01: MensajeGenerales.CUS6_EX01 }); break;
          }
          return throwError(error);
        })
      );
    }
    return of({});
  }

  private cumpleCondicion(): boolean {
    return !this.registroAlquileresForm.fieldNroDoc.errors &&
      (this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.RUC
        || this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.DNI) &&
      this.registroAlquileresForm.fieldRazSoc.value === null;
  }

  private tipoContribuyente(): Observable<string> {
    if (this.registroAlquileresForm.fieldNroDoc.value && this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.DNI) {
      return of(ConstantesDocumentos.DNI);
    } else if (this.registroAlquileresForm.fieldNroDoc.value && this.registroAlquileresForm.fieldTipoDoc.value === ConstantesDocumentos.RUC) {
      return of(ConstantesDocumentos.RUC);
    } else {
      return EMPTY;
    }
  }

  private actualizarNombrePersona(data: PersonaNatural): any {
    const nombre = data.desNombrePnat.trim() + ' ' + data.desApepatPnat.trim() + ' ' + data.desApematPnat.trim();
    this.spinner.hide();
    this.registroAlquileresForm.fieldRazSoc.setValue(nombre);
    return data;
  }

  private actualizarNombreContribuyente(data: PersonaJuridica): any {
    this.spinner.hide();
    this.registroAlquileresForm.fieldRazSoc.setValue(data.ddpNombre.trim());
    return data;
  }

  public seleccionarBien(tipoBien: string): void {
    this.registroAlquileresForm.habilitarCamposTipoBien(tipoBien);
    this.registroAlquileresForm.limpiarCamposTipoBien();
    if (tipoBien === this.BIEN_MUEBLE) {
      this.listaBienMuebles = this.bienMuebles;
    } else if (tipoBien === this.BIEN_INMUEBLE_DISTINTOS_DE_PREDIOS) {
      this.listaBienMuebles = this.bienInmueblesDistPre;
    }
  }

  public seleccionarTipoBien(): void {
    this.registroAlquileresForm.habilitarCamposDescTipoBien();
    this.registroAlquileresForm.limpiarCamposDescTipoBien();
    this.texto = this.registroAlquileresForm.obtenerDescripcion();
  }

  public metodo(): void {
    this.submitted = true;
    this.autocompletarNombre().subscribe(() => {
      this.spinner.hide();
      this.agregar();
    });
  }

  private agregar(): void {
    this.submitted = true;
    if (this.registroAlquileresForm.getForm.invalid) return;

    const alquileres = {
      numCorrPredio: 15000,
      codDocIdeDec: this.registroAlquileresForm.fieldTipoDoc.value,
      numDocIdeDec: this.registroAlquileresForm.fieldNroDoc.value.toUpperCase(),
      nomRazonAlq: this.registroAlquileresForm.fieldRazSoc.value.toUpperCase(),
      mtoAlquiler: Number(this.registroAlquileresForm.fieldMtoAlq.value),
      codTipBien: this.registroAlquileresForm.fieldTipoBien.value,
      codSubTipBien: this.registroAlquileresForm.fieldBienMueble.value,
      desBienAlq: this.registroAlquileresForm.fieldBienMuebleDesc.value ? String(this.registroAlquileresForm.fieldBienMuebleDesc.value).toUpperCase() : null,
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
      numMesesAlq: null,
      numVehiNave: null,
    };

    if (this.alquiler) {
      if (!this.equals(this.alquiler, alquileres)) {
        this.listaAlquileresInput = this.listaAlquileresInput.map(x => {
          if (this.equals(this.alquiler, x)) {
            x = alquileres;
          }
          return x;
        });
        this.listaAlquileresOutput.emit(this.listaAlquileresInput);
      }
    } else {
      this.listaAlquileresInput.push(alquileres);
      this.listaAlquileresOutput.emit(this.listaAlquileresInput);
    }
    this.activeModal.close();
  }

  private equals(obj: InfAlquileresModel, obj2: InfAlquileresModel): boolean {
    return obj2.numCorrPredio === obj.numCorrPredio &&
      obj2.codDocIdeDec === obj.codDocIdeDec &&
      obj2.numDocIdeDec === obj.numDocIdeDec &&
      obj2.nomRazonAlq === obj.nomRazonAlq &&
      obj2.mtoAlquiler === obj.mtoAlquiler &&
      obj2.codTipBien === obj.codTipBien &&
      obj2.codSubTipBien === obj.codSubTipBien &&
      obj2.desBienAlq === obj.desBienAlq &&
      obj2.codTipVia === obj.codTipVia &&
      obj2.desVia === obj.desVia &&
      obj2.codTipZona === obj.codTipZona &&
      obj2.desZona === obj.desZona &&
      obj2.numNro === obj.numNro &&
      obj2.numKilometro === obj.numKilometro &&
      obj2.numManzana === obj.numManzana &&
      obj2.numInterior === obj.numInterior &&
      obj2.numDpto === obj.numDpto &&
      obj2.numLote === obj.numLote &&
      obj2.desReferenc === obj.desReferenc &&
      obj2.codUbigeo === obj.codUbigeo &&
      obj2.numMesesAlq === obj.numMesesAlq &&
      obj2.numVehiNave === obj.numVehiNave;
  }
}
