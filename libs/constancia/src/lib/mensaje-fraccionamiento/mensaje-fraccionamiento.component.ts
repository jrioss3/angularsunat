import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rentas-mensaje-fraccionamiento',
  templateUrl: './mensaje-fraccionamiento.component.html',
  styleUrls: ['./mensaje-fraccionamiento.component.css']
})
export class MensajeFraccionamientoComponent implements OnInit {

  isChecked = 2;
  @Input() link: string;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  public aceptar(): void {
    if (this.isChecked === 1) {
        window.open(this.link, '_blank');
        this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }

  public cerrar(): void {
    this.activeModal.close();
  }

}
