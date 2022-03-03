import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeudasActivasModel } from '@path/juridico/models/SeccionDeterminativa/detCredImpuestoRtaModel';
import { PreDeclaracionService } from '@path/juridico/services/preDeclaracion.service';
import { NgbDateParsearFormato } from '@path/juridico/utils/ngb-date-parsear-formato';
import { CustomDatepickerI18n } from '@path/juridico/utils/ngdatepicker/custom-datepicker-i18n';
import { I18n } from '@path/juridico/utils/ngdatepicker/i18n';
import { ConstantesParametros, MensajeGenerales } from '@rentas/shared/constantes';
import { ListaParametro } from '@rentas/shared/types';
import { CasillasUtil, FuncionesGenerales } from '@rentas/shared/utils';
import { ErroresService, ModalConfirmarService } from '@rentas/shared/core';
import { Detalle297RegistroFormService } from './detalle297-registro-form.service';
import { ValidarCasilla297Service } from '@path/juridico/services/validar-casilla297.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-detalle297-registro',
  templateUrl: './detalle297-registro.component.html',
  styleUrls: ['./detalle297-registro.component.scss'],
  providers: [
    I18n, Detalle297RegistroFormService,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateParsearFormato },
  ],
})
export class Detalle297RegistroComponent extends CasillasUtil implements OnInit {

  @Output() listaDeudas = new EventEmitter<DeudasActivasModel[]>();
  @Input() inputDeudasRegistrar: DeudasActivasModel[];

  public submitted = false;
  public meses: ListaParametro[];
  public anioEjercicio: number;
  public valores: ListaParametro[];
  private funcionesGenerales = FuncionesGenerales.getInstance();
  public mensaje = MensajeGenerales;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private handlerError: ErroresService,
    private validarCas297: ValidarCasilla297Service,
    public detalle297Form: Detalle297RegistroFormService,
    private modalMensejaService: ModalConfirmarService,
    private predeclaracionService: PreDeclaracionService) {
    super();
  }

  public ngOnInit() {
    this.anioEjercicio = Number(this.predeclaracionService.obtenerNumeroEjercicio());
    this.meses = this.generarMeses();
    this.valores = [{ val: '1', desc: 'Valor' }, { val: '2', desc: 'Saldo Deudor' }];
    this.detalle297Form.inicializarFormulario();
  }

  private generarMeses(): ListaParametro[] {
    const listaAnios = [];
    for (let i = 1; i <= 12; i++) {
      const mes = String(i).length === 1 ? '0' + i : i;
      const periodo = mes + '/' + (this.anioEjercicio);
      listaAnios.push({ val: String(this.anioEjercicio) + mes, desc: periodo });
    }
    for (let i = 1; i <= 4; i++) {
      const mes = String(i).length === 1 ? '0' + i : i;
      const periodo = mes + '/' + (Number(this.anioEjercicio) + 1);
      listaAnios.push({ val: String((Number(this.anioEjercicio) + 1)) + mes, desc: periodo });
    }
    return listaAnios;
  }

  public activarNumValor() {
    if (this.detalle297Form.fieldValSalDeudor.value === '1') {
      this.detalle297Form.fieldNumValor.enable();
      this.detalle297Form.fieldFormDecJurada.disable();
      this.detalle297Form.fieldFormDecJurada.setValue(null);
      this.detalle297Form.fieldNumOrdDecJurada.disable();
      this.detalle297Form.fieldNumOrdDecJurada.setValue(null);
    } else if (this.detalle297Form.fieldValSalDeudor.value === '2') {
      this.detalle297Form.fieldNumOrdDecJurada.enable();
      this.detalle297Form.fieldFormDecJurada.enable();
      this.detalle297Form.fieldNumValor.disable();
      this.detalle297Form.fieldNumValor.setValue(null);
    } else {
      this.detalle297Form.fieldFormDecJurada.disable();
      this.detalle297Form.fieldFormDecJurada.setValue(null);
      this.detalle297Form.fieldNumOrdDecJurada.disable();
      this.detalle297Form.fieldNumOrdDecJurada.setValue(null);
      this.detalle297Form.fieldNumValor.disable();
      this.detalle297Form.fieldNumValor.setValue(null);
    }
  }

  public guardar(): void {
    this.submitted = true;

    if (this.detalle297Form.getForm.invalid) return;

    const modelo: DeudasActivasModel = {
      numFormul: ConstantesParametros.COD_FORMULARIO_PPJJ,
      numPerPagoCta: this.detalle297Form.fieldMesApli.value,
      numPerAplica: this.funcionesGenerales.formatearPeriodoFull(this.detalle297Form.fieldPeriodo.value),
      numVal: this.detalle297Form.fieldNumValor.value,
      codTri: this.funcionesGenerales.formatearTributo(this.detalle297Form.fieldCodTributo.value),
      mtoImpuesto: this.detalle297Form.fieldMontoApli.value,
      codOrigen: '1',
      indActivo: '1',
      codFor: this.detalle297Form.fieldFormDecJurada.value,
      numDoc: this.detalle297Form.fieldNumOrdDecJurada.value,
      numRes: this.detalle297Form.fieldNumResCom.value,
      id: this.generarId()
    }

    if (this.existeDuplicado()) {
      this.modalMensejaService.msgValidaciones(MensajeGenerales.CUS23_EX07, 'Mensaje');
    } else {
      if (this.anioEjercicio >= 2021 || this.detalle297Form.fieldValSalDeudor.value === '1') {
        this.spinner.show();
        this.validarCas297.obtenerDetalleCas297(modelo, this.detalle297Form.fieldValSalDeudor.value).subscribe(
          () => {
            this.spinner.hide();
            this.inputDeudasRegistrar.push(modelo);
            this.listaDeudas.emit(this.inputDeudasRegistrar);
            this.activeModal.close();
          }, error => {
            this.handlerError.mostarModalError(error);
            this.spinner.hide();
          });
      } else {
        this.inputDeudasRegistrar.push(modelo);
        this.listaDeudas.emit(this.inputDeudasRegistrar);
        this.activeModal.close();
      }
    }
  }

  private generarId(): number {
    return this.inputDeudasRegistrar.length !== 0 ? Number(this.inputDeudasRegistrar[this.inputDeudasRegistrar.length - 1].id) + 1 : 0;
  }

  private existeDuplicado(): boolean {
    if (this.detalle297Form.habilitarItan.habilitarCasillasITAN()) {
      if (this.detalle297Form.fieldValSalDeudor.value === '1') {
        return this.inputDeudasRegistrar.some(x => {
          return this.detalle297Form.fieldMesApli.value === x.numPerPagoCta && this.funcionesGenerales.formatearPeriodoFull(this.detalle297Form.fieldPeriodo.value) === x.numPerAplica
            && this.detalle297Form.fieldNumValor.value === x.numVal && this.funcionesGenerales.formatearTributo(this.detalle297Form.fieldCodTributo.value) === x.codTri && x.indActivo === '1'
            && this.detalle297Form.fieldNumResCom.value === x.numRes && this.detalle297Form.fieldMontoApli.value === x.mtoImpuesto;
        });
      } else {
        return this.inputDeudasRegistrar.some(x => {
          return this.detalle297Form.fieldMesApli.value === x.numPerPagoCta && this.funcionesGenerales.formatearPeriodoFull(this.detalle297Form.fieldPeriodo.value) === x.numPerAplica
            && this.funcionesGenerales.formatearTributo(this.detalle297Form.fieldCodTributo.value) === x.codTri && x.indActivo === '1' && this.detalle297Form.fieldNumOrdDecJurada.value === x.numDoc
            && this.detalle297Form.fieldFormDecJurada.value === x.codFor && this.detalle297Form.fieldNumResCom.value === x.numRes && this.detalle297Form.fieldMontoApli.value === x.mtoImpuesto;
        });
      }
    } else {
      if (this.detalle297Form.fieldValSalDeudor.value === '1') {
        return this.inputDeudasRegistrar.some(x => {
          return this.detalle297Form.fieldMesApli.value === x.numPerPagoCta && this.funcionesGenerales.formatearPeriodoFull(this.detalle297Form.fieldPeriodo.value) === x.numPerAplica
            && this.detalle297Form.fieldNumValor.value === x.numVal && this.funcionesGenerales.formatearTributo(this.detalle297Form.fieldCodTributo.value) === x.codTri && x.indActivo === '1';
        });
      } else {
        return this.inputDeudasRegistrar.some(x => {
          return this.detalle297Form.fieldMesApli.value === x.numPerPagoCta && this.funcionesGenerales.formatearPeriodoFull(this.detalle297Form.fieldPeriodo.value) === x.numPerAplica
            && this.funcionesGenerales.formatearTributo(this.detalle297Form.fieldCodTributo.value) === x.codTri && x.indActivo === '1';
        });
      }
    }
  }
}
