import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rentas-reporte-marca-agua',
  templateUrl: './reporte-marca-agua.component.html',
  styleUrls: ['./reporte-marca-agua.component.css']
})
export class ReporteMarcaAguaComponent implements OnInit {

  @Input() esPreliminar: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
