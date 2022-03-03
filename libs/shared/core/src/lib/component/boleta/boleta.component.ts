import { Component, Input, OnInit } from '@angular/core';
import { RowConstnacia } from '@rentas/shared/types';
import { Nidi } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-boleta',
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.css']
})
export class BoletaComponent extends Nidi implements OnInit {

  @Input() rowConstnacia: RowConstnacia = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
