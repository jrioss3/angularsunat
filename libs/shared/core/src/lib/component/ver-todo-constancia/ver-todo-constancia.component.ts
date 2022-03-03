import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RowConstnacia } from '@rentas/shared/types';
import { saveAs } from 'file-saver';

import { NgxSpinnerService } from 'ngx-spinner';
import { ConstanciaEnviarGuardarService } from '../../service/constancia-enviar-guardar.service';
import { ErroresService } from '../../service/errores.service';

@Component({
  selector: 'rentas-ver-todo-constancia',
  templateUrl: './ver-todo-constancia.component.html',
  styleUrls: ['./ver-todo-constancia.component.css']
})
export class VerTodoConstanciaComponent implements OnInit {

  @Input() listRowConstnacia: Array<RowConstnacia> = [];

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private constEnviarGuardar: ConstanciaEnviarGuardarService,
    private spinner: NgxSpinnerService,
    private handlerError: ErroresService
  ) { }

  ngOnInit(): void {
  }

  public guardarConstancia(): void {
    this.spinner.show();
    const idPresentacion = this.listRowConstnacia[0].resultado.numeroOperacionSunat;
    const numeroDocumento = this.listRowConstnacia[0].resultado.numeroRUC;

    this.constEnviarGuardar.guardarMasivo(idPresentacion).subscribe(respuesta => {
      saveAs(respuesta, `${numeroDocumento}.pdf`);
      this.spinner.hide();
    }, error => {
      this.handlerError.mostarModalError(error);
      this.spinner.hide();
    });
  }

  public enviarCorreo(): void {
    const idPresentacion = this.listRowConstnacia[0].resultado.numeroOperacionSunat;
    const razonSocial = this.listRowConstnacia[0].resultado.razonSocial;
    this.constEnviarGuardar.enviarCorreoMasivo({ idPresentacion, razonSocial });
  }

}
