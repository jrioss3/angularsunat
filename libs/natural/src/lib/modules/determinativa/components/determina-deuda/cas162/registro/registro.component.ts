import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesCombos, ConstantesTributos, MensajeGenerales } from '@rentas/shared/constantes';
import { C162RegistroFormService } from './registro-form.service';
import { DeudaPagosPreviosModel } from '@path/natural/models';
import { ComboService, ModalConfirmarService, PagosPreviosService } from '@rentas/shared/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListaParametro } from '@rentas/shared/types';

@Component({
  selector: 'rentas--registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class C162RegistroComponent implements OnInit {

  @Input() listaPagosPrevios: DeudaPagosPreviosModel[];
  @Output() listaPagosPreviosResponse = new EventEmitter<DeudaPagosPreviosModel[]>();
  public submitted = false;
  public listaFormularios: ListaParametro[];
  public mensaje = MensajeGenerales;
  public tributoDescripcion = '';

  constructor(public activeModal: NgbActiveModal,
    public registroForm: C162RegistroFormService,
    private spinner: NgxSpinnerService,
    private comboService: ComboService,
    private pagosPreviosService: PagosPreviosService,
    private modalService: ModalConfirmarService) { }

  public ngOnInit(): void {
    this.listaFormularios = this.comboService.obtenerComboPorNumero(ConstantesCombos.FORMULARIOS_PAGOS_PREVIOS);
    this.listaFormularios.unshift({ val: null, desc: '--Seleccionar--' });
    
    this.tributoDescripcion =  ConstantesTributos.RENTA_CAPITAL.codigo + ' - ' + ConstantesTributos.RENTA_CAPITAL.descripcion;   
    this.registroForm.getForm.reset();
  } 

  public guardar(): void {
    this.registroForm.getForm.markAllAsTouched();   
    if (this.registroForm.fieldFormulario.value === 'null') this.registroForm.fieldFormulario.setValue(null);
    if (this.registroForm.getForm.invalid)  return;

    const guardar = this.listaPagosPrevios.some(x => {
      return this.registroForm.fieldNroOrden.value === x.numOrd && this.registroForm.fieldFormulario.value === x.codFor;
    });

    if (!guardar) {           
        this.spinner.show();
        this.pagosPreviosService.obtenerPago(this.registroForm.fieldNroOrden.value, this.registroForm.fieldFormulario.value, ConstantesTributos.RENTA_CAPITAL.codigo)
        .subscribe(data => {
          this.spinner.hide();
          const modelo = {
            codTri: ConstantesTributos.RENTA_CAPITAL.codigo,
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
