import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { SubCabeceraComponent } from './sub-cabecera/sub-cabecera.component';
import { CerrarSesionService } from '@rentas/shared/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedCoreModule } from '@rentas/shared/core';

@NgModule({
imports: [CommonModule , HttpClientModule, SharedCoreModule ],
  declarations: [CabeceraComponent, SubCabeceraComponent],
  exports : [CabeceraComponent, SubCabeceraComponent],
  providers : [ CerrarSesionService ],
})
export class CabeceraModule {}
