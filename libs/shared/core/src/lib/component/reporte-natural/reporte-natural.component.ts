import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantesUris } from '@rentas/shared/constantes';
import { ReporteGuardarSolicitud, TipoReporte } from '@rentas/shared/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteGuardarEnviarService } from '../../service/reporte-guardar-enviar.service';
import { ReporteEnviarCorreoComponent } from '../reporte-enviar-correo/reporte-enviar-correo.component';
import { saveAs } from 'file-saver';
import { AbrirModalService } from '../../service/abrir-modal.service';

@Component({
  selector: 'rentas-reporte-natural',
  templateUrl: './reporte-natural.component.html',
  styleUrls: ['./reporte-natural.component.css']
})
export class ReporteNaturalComponent implements OnInit {

  @Input() preDeclaracion: any;
  @Input() tipoReporte: TipoReporte;
  @Input() razonSocial: string;
  @Input() fechaPresentacion: string;
  @Input() numOrden: string;

  uriDescargaPreliminar = ConstantesUris.URI_DESCARGAR_PPNN_PRELIMINAR_SIMPLE;
  uriDescargaDefinitiva = ConstantesUris.URI_DESCARGAR_PPNN_SIMPLE;
  urienviarPreliminar = ConstantesUris.URI_ENVIAR_PPNN_PRELIMINAR_SIMPLE;
  urienviarDefinitiva = ConstantesUris.URI_ENVIAR_PPNN_SIMPLE;

  constructor(
    public activeModal: NgbActiveModal,
    private abrirModalService: AbrirModalService,
    private spinner: NgxSpinnerService,
    private rpoGuardarEnviar: ReporteGuardarEnviarService
  ) { }

  ngOnInit(): void {

  }

  public enviar(): void {
    const modalRef = this.abrirModalService.abrirModal(ReporteEnviarCorreoComponent);
    modalRef.componentInstance.tipoReporte = this.tipoReporte;
    modalRef.componentInstance.url = this.getUriEnviar();
    modalRef.componentInstance.solicitud = {
      correos: [],
      razonSocial: this.razonSocial,
      declaracionPN: this.preDeclaracion.declaracion
    };
  }

  public close() {
    this.activeModal.close();
  }

  public guardar(): void {
    this.spinner.show();
    const solicitud: ReporteGuardarSolicitud = {
      correos: null,
      razonSocial: this.razonSocial,
      declaracionPN: this.preDeclaracion.declaracion
    };

    this.spinner.show();

    this.rpoGuardarEnviar.guardar(this.getUriGuardar(), solicitud).subscribe(respuesta => {
      this.spinner.hide();
      saveAs(respuesta.file, respuesta.name);
    }, error => {
      console.error(error);
      this.spinner.hide();
    });
  }

  private getUriGuardar() {
    if (this.tipoReporte === TipoReporte.PRELIMINAR) {
      return this.uriDescargaPreliminar;
    } else if (this.tipoReporte === TipoReporte.DEFINITIVO) {
      return this.uriDescargaDefinitiva;
    }
  }

  private getUriEnviar() {
    if (this.tipoReporte === TipoReporte.PRELIMINAR) {
      return this.urienviarPreliminar;
    } else if (this.tipoReporte === TipoReporte.DEFINITIVO) {
      return this.urienviarDefinitiva;
    }
  }

}
