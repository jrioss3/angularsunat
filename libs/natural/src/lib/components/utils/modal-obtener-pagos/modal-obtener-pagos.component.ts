import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesCadenas } from './../../../utils/constantescadenas';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TributoPagado } from './../../../models/tributo-pagado';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal-obtener-pagos',
  templateUrl: './modal-obtener-pagos.component.html',
  styleUrls: ['./modal-obtener-pagos.component.css']
})
export class ModalObtenerPagosComponent implements OnInit, AfterViewInit {

  @Input() tributosPagados: Array<TributoPagado>;
  @Input() isPago: boolean;
  @Input() isPagoCero: boolean;
  @Input() tributo: string;
  @Output() respuesta = new EventEmitter<string>();

  constructor(
    private modalService: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  public ngOnInit() {
  }

  public cerrar(): void {
    this.respuesta.emit(ConstantesCadenas.RESPUESTA_NO);
    this.modalService.close();
  }

  public aceptar(): void {
    this.respuesta.emit(ConstantesCadenas.RESPUESTA_SI);
    this.modalService.close();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.spinner.hide(), 100);
  }

}
