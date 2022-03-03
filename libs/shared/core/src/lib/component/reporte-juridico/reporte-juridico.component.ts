import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReporteGuardarSolicitud, TipoReporte } from '@rentas/shared/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { ConstantesUris } from '@rentas/shared/constantes';
import { ReporteGuardarEnviarService } from '../../service/reporte-guardar-enviar.service';
import { ReporteEnviarCorreoComponent } from '../reporte-enviar-correo/reporte-enviar-correo.component';
import { AbrirModalService } from '../../service/abrir-modal.service';

@Component({
  selector: 'rentas-reporte-juridico',
  templateUrl: './reporte-juridico.component.html',
  styleUrls: ['./reporte-juridico.component.css']
})
export class ReporteJuridicoComponent implements OnInit {

  @Input() preDeclaracion: any;
  @Input() tipoReporte: TipoReporte;
  @Input() razonSocial: string;
  @Input() fechaPresentacion: string;
  @Input() numOrden: string;

  uriDescargaPreliminar = ConstantesUris.URI_DESCARGAR_PPJJ_PRELIMINAR_SIMPLE;
  uriDescargaDefinitiva = ConstantesUris.URI_DESCARGAR_PPJJ_SIMPLE;
  urienviarPreliminar = ConstantesUris.URI_ENVIAR_PPJJ_PRELIMINAR_SIMPLE;
  urienviarDefinitiva = ConstantesUris.URI_ENVIAR_PPJJ_SIMPLE;
  private posicionCarousel = 0;
  public previousButton = false;
  public nextButton = true;
  private quantityReport = 5;
  public report = {
    reporte0: true,
    reporte1: false,
    reporte2: false,
    reporte3: false,
    reporte4: false,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private abrirModalService: AbrirModalService,
    private spinner: NgxSpinnerService,
    private rpoGuardarEnviar: ReporteGuardarEnviarService
  ) {
  }

  ngOnInit(): void {

  }

  public enviar(): void {
    const modalRef = this.abrirModalService.abrirModal(ReporteEnviarCorreoComponent);
    modalRef.componentInstance.tipoReporte = this.tipoReporte;
    modalRef.componentInstance.url = this.getUriEnviar();
    modalRef.componentInstance.solicitud = {
      correos: [],
      razonSocial: this.razonSocial,
      declaracionPJ: this.preDeclaracion.declaracion
    };
  }

  public guardar(): void {
    this.spinner.show();
    const solicitud: ReporteGuardarSolicitud = {
      correos: null,
      razonSocial: this.razonSocial,
      declaracionPJ: this.preDeclaracion.declaracion
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

  public nextReport(): void {
    if (this.posicionCarousel === (this.quantityReport - 1)) {
      this.nextButton = false;
    } else {
      this.previousButton = true;

      this.nextButton = true;
      this.report['reporte' + this.posicionCarousel] = false;
      this.posicionCarousel++;
      if (this.posicionCarousel === (this.quantityReport - 1)) {
        this.nextButton = false;
      }
      this.report['reporte' + this.posicionCarousel] = true;
    }
  }

  public previousReport(): void {
    if (this.posicionCarousel === 0) {
      this.previousButton = false;
    } else {
      this.previousButton = true;
      this.nextButton = true;
      this.report['reporte' + this.posicionCarousel] = false;
      this.posicionCarousel--;
      if (this.posicionCarousel === 0) {
        this.previousButton = false;
      }
      this.report['reporte' + this.posicionCarousel] = true;
    }
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
