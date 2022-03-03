import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesCombos, ConstantesTributos, MensajeGenerales } from '@rentas/shared/constantes';
import { C363RegistroFormService } from './registro-form.service';
import { DeudaPagosPreviosModel } from '@path/natural/models';
import { ComboService, ModalConfirmarService, PagosPreviosService } from '@rentas/shared/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListaParametro } from '@rentas/shared/types';

@Component({
  selector: 'rentas--registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class C363RegistroComponent implements OnInit {

  @Input() listaPagosPrevios: DeudaPagosPreviosModel[];
  @Output() listaPagosPreviosResponse = new EventEmitter<DeudaPagosPreviosModel[]>();
  
  public listaFormulaios: ListaParametro[];
  public mensaje = MensajeGenerales;
  public tributoDescripcion = '';

  constructor(public activeModal: NgbActiveModal,
    public registroForm: C363RegistroFormService,
    private spinner: NgxSpinnerService,
    private comboService: ComboService,
    private pagosPreviosService: PagosPreviosService,
    private modalService: ModalConfirmarService) { }

  public ngOnInit(): void {
    this.listaFormulaios = this.comboService.obtenerComboPorNumero(ConstantesCombos.FORMULARIOS_PAGOS_PREVIOS);
    this.listaFormulaios.unshift({ val: null, desc: '--Seleccionar--' });   
    this.tributoDescripcion =  ConstantesTributos.RENTA_2DA_CATEGORIA.descripcion;
    this.registroForm.getForm.reset();
  }

  public guardar(): void {
    this.registroForm.getForm.markAllAsTouched();    
    if (this.registroForm.fieldFormulario.value === 'null') this.registroForm.fieldFormulario.setValue(null);
    if (this.registroForm.getForm.invalid) return;

    const guardar = this.listaPagosPrevios.some(x => {
      return this.registroForm.fieldNroOrden.value === x.numOrd && this.registroForm.fieldFormulario.value === x.codFor;
    });

    if (!guardar) {
      this.spinner.show();
      this.pagosPreviosService.obtenerPago(this.registroForm.fieldNroOrden.value, this.registroForm.fieldFormulario.value, ConstantesTributos.RENTA_2DA_CATEGORIA.codigo)
        .subscribe(data => {
          this.spinner.hide();
          const modelo = {
            codTri: ConstantesTributos.RENTA_2DA_CATEGORIA.codigo,
            numOrd: this.registroForm.fieldNroOrden.value,
            fecPres: data.fecPres,
            mtoPag: data.mtoPag,
            indSel: '1',
            codFor: this.registroForm.fieldFormulario.value
          };
          this.listaPagosPrevios.push(modelo);
          this.listaPagosPreviosResponse.emit(this.listaPagosPrevios);
          this.activeModal.close();
        }, () => {
          this.modalService.msgValidaciones(MensajeGenerales.CUS21_EX02, 'Mensaje');
          this.spinner.hide();
          this.registroForm.getForm.reset();
        });
    } else {
      this.modalService.msgValidaciones(MensajeGenerales.CUS21_EX05, 'Mensaje');
    }
  }

}
