import { Component, OnInit } from '@angular/core';
import { PreDeclaracionModel } from '@path/juridico/models/preDeclaracionModel';
import { CasillaService } from '@rentas/shared/core';
import { FuncionesGenerales, SessionStorage } from '@rentas/shared/utils';
import { EmpresasConstructorasFormService } from './empresas-constructoras-form.service';

@Component({
  selector: 'app-ic-empresas-constructoras',
  templateUrl: './empresas-constructoras.component.html',
  styleUrls: ['./empresas-constructoras.component.css'],
  providers: [EmpresasConstructorasFormService]
})
export class EmpresasConstructorasComponent implements OnInit {

  private preDeclaracion: PreDeclaracionModel;
  public casilla293 = this.casillaService.obtenerCasilla('293');

  constructor(private casillaService: CasillaService,
    public constructorasForm: EmpresasConstructorasFormService) { }

  public ngOnInit() {
    this.preDeclaracion = SessionStorage.getPreDeclaracion<PreDeclaracionModel>();
    const casilla293 = FuncionesGenerales.getInstance()
      .opcionalText(this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas293);
    this.constructorasForm.inicializarFormulario(casilla293);
  }

  public respuestaSeleccionada(respuesta: string) {
    this.constructorasForm.fieldRespuesta.setValue(respuesta);
    this.actualizarPredeclaracion();
  }

  private actualizarPredeclaracion(): void {
    if (this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas293 === this.constructorasForm.fieldRespuesta.value) {
      this.constructorasForm.fieldRespuesta.setValue(null);
    }
    this.preDeclaracion.declaracion.seccInformativa.casInformativa.mtoCas293 = this.constructorasForm.fieldRespuesta.value;
    SessionStorage.setPreDeclaracion(this.preDeclaracion);
  }
}
