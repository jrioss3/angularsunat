import { Component, OnInit } from '@angular/core';
import { Rutas } from '@rentas/shared/constantes';

@Component({
  selector: 'rentas-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public isOpen = true;
  public isDock = true
  public classButton = 'fas fa-angle-left';
  
  public pathBienvenida = `/${Rutas.BIENVENIDA}`;
  
  constructor() { }

  ngOnInit(): void {
  }

  alternarBarraLateral(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.classButton = 'fas fa-angle-left';
    } else {
      this.classButton = 'fas fa-angle-right';
    }
    
  }

}
