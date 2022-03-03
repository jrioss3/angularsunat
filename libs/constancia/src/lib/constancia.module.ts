import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstanciaComponent } from './constancia/constancia.component';
import { ConstanciaRoutingModule } from './constancia-routing.module';
import { CabeceraModule } from '@rentas/cabecera';
import { CoreModule } from './core/core.module';
import { LinkDevolucionComponent } from './link-devolucion/link-devolucion.component';
import { TabNpsComponent } from './tab-nps/tab-nps.component';
import { TabResumenTransaccionesComponent } from './tab-resumen-transacciones/tab-resumen-transacciones.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    ConstanciaRoutingModule,
    CabeceraModule,
    CoreModule,
    NgxSpinnerModule
  ],
  declarations: [ConstanciaComponent, LinkDevolucionComponent, TabNpsComponent, TabResumenTransaccionesComponent],
  exports: [ConstanciaComponent],
})
export class ConstanciaModule {}
