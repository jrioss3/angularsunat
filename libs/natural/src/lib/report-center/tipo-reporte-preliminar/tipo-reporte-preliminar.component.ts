import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, animate, style } from '@angular/animations';
import { PreDeclaracionService } from '../../services/preDeclaracion.service';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorage } from '@rentas/shared/utils';
import { TipoReporte } from '@rentas/shared/types';
import { ReporteSimpleService } from '@rentas/shared/core';

@Component({
  selector: 'app-tipo-reporte-preliminar',
  templateUrl: './tipo-reporte-preliminar.component.html',
  styleUrls: ['./tipo-reporte-preliminar.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class ModalReportePreliminarComponent implements OnInit {

  public rdRepSimpleChecked = false;
  public rdRepDetalladoChecked = false;
  private tipoReporteSelected = '';

  constructor(
    public modalService: NgbActiveModal,
    public activeModal: NgbActiveModal,
    private preDeclaracionService: PreDeclaracionService,
    private spinner: NgxSpinnerService,
    private reporteSimple: ReporteSimpleService
    ) { }

  ngOnInit() { 
    
  }

  public selTipoReporte(event): void {
    this.tipoReporteSelected = event.target.value;
  }

  public aceptarInit(): void {
    if (this.tipoReporteSelected === 'S') {
      this.abrirReportePreliminarSimple();
      this.activeModal.close();
    } else if (this.tipoReporteSelected === 'D') {
      this.descargarReportePreliminar();
      this.activeModal.close();
    }
  }

  private descargarReportePreliminar(): void {
    this.spinner.show();
    this.preDeclaracionService.enviarCorreo().subscribe(data => {
      const filename = data.headers.get('content-disposition').split(' ').pop().split('=').pop();
      saveAs(data.body, filename);
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private abrirReportePreliminarSimple(): void {

    const predeclaracion = SessionStorage.getPreDeclaracion();
    this.reporteSimple.mostrarReporteNatural({
      preDeclaracion: predeclaracion,
      tipoReporte: TipoReporte.PRELIMINAR,
      razonSocial: SessionStorage.getUserData().nombreCompleto
    });

    /* const modalRef = this.modalServiceReport.open(DeclarationReportComponent, this.funcionesGenerales.getModalOptions({ size: 'lg' }));
    modalRef.componentInstance.esPreliminar = true;
    modalRef.componentInstance.title = 'Reporte Preliminar Simple'; */
  }
}
