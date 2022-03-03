import { Component, OnInit } from '@angular/core';
import { GeneralCasillasUtil } from '../utils/general-casillas-util';

@Component({
  selector: 'rentas-control-casillas',
  templateUrl: './control-casillas.component.html',
  styleUrls: ['./control-casillas.component.css']
})
export class ControlCasillasComponent extends GeneralCasillasUtil implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {

  }



}
