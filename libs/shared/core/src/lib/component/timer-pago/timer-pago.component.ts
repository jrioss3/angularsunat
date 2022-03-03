import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'rentas-timer-pago',
  templateUrl: './timer-pago.component.html',
  styleUrls: ['./timer-pago.component.css']
})
export class TimerPagoComponent implements OnInit {

  @Input() winopenPopad: any;
  @Output() event = new EventEmitter<any>();
  ninuto = 4;
  segundo = 59;
  unbral = 0;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    const id = setInterval(() => {

      if (this.segundo === 0) {
        this.unbral++;
        if (this.unbral === 5) {
          clearInterval(id);
          this.event.emit();
          this.activeModal.close();
          return;
        }
        this.ninuto--;
        this.segundo = 60;
      }

      if (this.winopenPopad.isClosed()) {
        clearInterval(id);
        this.activeModal.close();
      }

      this.segundo--;

    }, 1000);
  }

}
