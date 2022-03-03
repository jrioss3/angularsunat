import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnviarConstanciaSolicitud } from '@rentas/shared/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErroresService } from '../../service/errores.service';


@Component({
  selector: 'rentas-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  styleUrls: ['./enviar-correo.component.css']
})
export class EnviarCorreoComponent implements OnInit {

  controlCorreo: FormControl;
  respuestaCorreo: string = null;

  @Input() uri: string;
  @Input() solicitud: EnviarConstanciaSolicitud;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private handlerError: ErroresService) {
    this.controlCorreo = new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.maxLength(50)
    ]);
  }

  ngOnInit(): void {
  }

  cerrar(): void {
    this.activeModal.close();
  }

  enviarCorreo(): void {
    this.solicitud.listCorreos = this.controlCorreo.value;
    this.spinner.show();
    this.http.post(this.uri, this.solicitud).pipe(
      catchError(error => {
        this.handlerError.mostarModalError(error);
        return throwError(error);
      })
    )
      .subscribe((data: any) => {
        this.respuestaCorreo = data.msg;
        setTimeout(() => this.respuestaCorreo = null, 3000);
        this.spinner.hide();
      }, () => this.spinner.hide());
  }


  get siTieneErrores(): boolean {
    return this.controlCorreo.invalid && this.controlCorreo.dirty;
  }

  get isErrorRequired() {
    return this.controlCorreo.hasError('required');
  }

  get isErrorMail() {
    return this.controlCorreo.hasError('email');
  }

  get isErrormaxLength() {
    return this.controlCorreo.hasError('maxlength');
  }

}
