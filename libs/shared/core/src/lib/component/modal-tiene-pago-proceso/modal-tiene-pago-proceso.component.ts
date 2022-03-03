import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';

@Component({
  selector: 'rentas-modal-tiene-pago-proceso',
  templateUrl: './modal-tiene-pago-proceso.component.html',
  styleUrls: ['./modal-tiene-pago-proceso.component.css']
})
export class ModalTienePagoProcesoComponent implements OnInit {

  @Input() errores: Array<string>;

  constructor(
    private modalService: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public aceptar(): void {
    this.router.navigate([Rutas.BIENVENIDA]);
    this.modalService.close();
  }

}
