import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Nidi } from '@rentas/shared/utils';
import { RowConstnacia } from '@rentas/shared/types';
import { saveAs } from 'file-saver';

import { NgxSpinnerService } from 'ngx-spinner';
import { ConstanciaEnviarGuardarService } from '../../service/constancia-enviar-guardar.service';
import { ErroresService } from '../../service/errores.service';

@Component({
  selector: 'rentas-ver-constancia',
  templateUrl: './ver-constancia.component.html',
  styleUrls: ['./ver-constancia.component.css']
})
export class VerConstanciaComponent extends Nidi implements OnInit {

  @Input() rowConstnacia: RowConstnacia = null;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private constEnviarGuardar: ConstanciaEnviarGuardarService,
    private spinner: NgxSpinnerService,
    private handlerError: ErroresService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  guardarConstancia(): void {
    this.spinner.show();
    const idPresentacion = this.rowConstnacia.resultado.numeroOperacionSunat;
    const numeroDocumento = this.rowConstnacia.resultado.numeroRUC;
    const numOrd = this.rowConstnacia.numeroOrden.toString();
    this.constEnviarGuardar.guardar(idPresentacion, numOrd).subscribe(respuesta => {
      saveAs(respuesta, `${numeroDocumento}.pdf`);
      this.spinner.hide();
    }, error => {
      this.handlerError.mostarModalError(error);
      this.spinner.hide();
    });
  }

  enviarCorreo(): void {
    const idPresentacion = this.rowConstnacia.resultado.numeroOperacionSunat;
    const razonSocial = this.rowConstnacia.resultado.razonSocial;
    const numOrd = this.rowConstnacia.numeroOrden.toString();
    this.constEnviarGuardar.enviarCorreo({ idPresentacion, razonSocial, numOrd });
  }

}
