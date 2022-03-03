import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesCombos, ConstantesTributos, MensajeGenerales } from '@rentas/shared/constantes';
import { Detalle144RegistroFormService } from './detalle144-registro-form.service';
import { DeudaPagosPreviosModel } from '@path/natural/models';
import { ComboService, ModalConfirmarService, PagosPreviosService } from '@rentas/shared/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListaParametro } from '@rentas/shared/types';

@Component({
  selector: 'rentas-detalle144-registro',
  templateUrl: './detalle144-registro.component.html',
  styleUrls: ['./detalle144-registro.component.css'],
  providers: [Detalle144RegistroFormService]
})
export class Detalle144RegistroComponent implements OnInit {

  @Input() listaPagosPrevios: DeudaPagosPreviosModel[];
  @Output() listaPagosPreviosResponse = new EventEmitter<DeudaPagosPreviosModel[]>();
  public submitted = false;
  public listaFormulaios: ListaParametro[];
  public mensaje = MensajeGenerales;

  constructor(public activeModal: NgbActiveModal,
    public detalle144Form: Detalle144RegistroFormService,
    private spinner: NgxSpinnerService,
    private comboService: ComboService,
    private pagosPreviosService: PagosPreviosService,
    private modalService: ModalConfirmarService) { }

  public ngOnInit(): void {
    this.listaFormulaios = this.comboService.obtenerComboPorNumero(ConstantesCombos.FORMULARIOS_PAGOS_PREVIOS);
    this.detalle144Form.getForm.reset();
  }

  public guardar(): void {
    this.submitted = true;
    if (this.detalle144Form.getForm.invalid) return;

    const guardar = this.listaPagosPrevios.some(x => {
      return this.detalle144Form.fieldNroOrden.value === x.numOrd && this.detalle144Form.fieldFormulario.value === x.codFor;
    });

    if (!guardar) {
      this.spinner.show();
      this.pagosPreviosService.obtenerPago(this.detalle144Form.fieldNroOrden.value, this.detalle144Form.fieldFormulario.value, ConstantesTributos.RENTA_PERS_JUR.codigo)
        .subscribe(data => {
          this.spinner.hide();
          const modelo = {
            codTri: ConstantesTributos.RENTA_PERS_JUR.codigo,
            numOrd: this.detalle144Form.fieldNroOrden.value,
            fecPres: data.fecPres,
            mtoPag: data.mtoPag,
            indSel: '1',
            codFor: this.detalle144Form.fieldFormulario.value
          };
          this.listaPagosPrevios.push(modelo);
          this.listaPagosPreviosResponse.emit(this.listaPagosPrevios);
          this.activeModal.close();
        }, () => {
          this.modalService.msgValidaciones(MensajeGenerales.CUS21_EX02, 'Mensaje');
          this.spinner.hide();
        });
    } else {
      this.modalService.msgValidaciones(MensajeGenerales.CUS21_EX05, 'Mensaje');
    }
  }

  public keyPress(event): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && (event.charCode !== 0)) {
      event.preventDefault();
    }
  }

}
