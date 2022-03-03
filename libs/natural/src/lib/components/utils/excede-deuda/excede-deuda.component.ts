import { ConstantesCadenas } from './../../../utils/constantescadenas';
import { PreDeclaracionService } from '@path/natural/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { TributoPagado } from './../../../models/tributo-pagado';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ExcedeDeudaService } from '@path/natural/services/excede-deuda.service';

@Component({
  selector: 'app-excede-deuda',
  templateUrl: './excede-deuda.component.html',
  styleUrls: ['./excede-deuda.component.css']
})
export class ExcedeDeudaComponent implements OnInit, AfterViewInit {

  @Input() tributos: Array<TributoPagado> = [];
  @Output() respuesta = new EventEmitter<string>();

  listaPagos: Array<TributoPagado> = [] ;

  constructor(
    private modalService: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  public aceptar(): void {
    this.respuesta.emit(ConstantesCadenas.RESPUESTA_NO);
    this.modalService.close();
  }

  public cerrar(): void {
    this.respuesta.emit(ConstantesCadenas.RESPUESTA_NO);
    this.modalService.close();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.spinner.hide(), 100);
  }

}
