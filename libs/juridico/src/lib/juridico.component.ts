import { Component, OnInit } from '@angular/core';
import { FormulasService } from './services/formulas.service';

@Component({
  selector: 'rentas-juridico',
  templateUrl: './juridico.component.html',
  styleUrls: ['./juridico.component.css'],
  providers: [FormulasService]
})
export class JuridicoComponent implements OnInit {
  ngOnInit(): void {}
}
