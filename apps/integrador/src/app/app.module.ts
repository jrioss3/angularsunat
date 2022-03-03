import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MenuModule } from '@rentas/menu';
import { AppRoutingModule } from './app-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CabeceraModule } from '@rentas/cabecera';
import { ListaErroresModule } from '@rentas/lista-errores';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';

@NgModule({
  declarations: [AppComponent, BienvenidaComponent],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    AppRoutingModule,
    CabeceraModule,
    MenuModule,
    ListaErroresModule
  ],
  providers:[
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
