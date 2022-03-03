import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';
import { MenuComponent } from './menu/menu.component';
import { OpcionesComponent } from './opciones/opciones.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { RouterModule } from '@angular/router';
import { TreeModule } from '@circlon/angular-tree-component';

@NgModule({
  imports: [CommonModule, SidebarModule, RouterModule , TreeModule],
  declarations: [MenuComponent, OpcionesComponent, CabeceraComponent],
  exports: [MenuComponent],
})
export class MenuModule {}
