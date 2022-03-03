import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';

@Component({
  selector: 'app-modal-redireccionar',
  templateUrl: './modal-redireccionar.component.html',
  styleUrls: ['./modal-redireccionar.component.css']
})
export class ModalRedireccionarComponent implements OnInit {

  @Input() errores: Array<any>;

  constructor(
    private modalService: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public aceptar(): void {
    this.router.navigate([Rutas.NATURAL]);
    this.modalService.close();
  }

}
