import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Rutas } from '@rentas/shared/constantes';
import { CerrarSesionService, ComboService, DispositivoService, AutoGuardadoService, ErroresService, ChatErrorService } from '@rentas/shared/core';
import { zip } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SessionStorage } from '@rentas/shared/utils';

@Component({
  selector: 'rentas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'integrador';

  constructor(
    private comboService: ComboService,
    private dispositivoService: DispositivoService,
    private cerrarSesionService: CerrarSesionService,
    private autoGuardadoService: AutoGuardadoService,
    private chatErrorService: ChatErrorService,
    private router: Router
  ) {

    this.router.events
      .pipe(
        filter(evento => evento instanceof NavigationEnd),
        tap(this.detenerAutoguardado.bind(this)),
        tap(this.clearlistaErrores.bind(this))
      ).subscribe();
  }

  ngOnInit(): void {
    this.dispositivoService.solicitarIP().subscribe(ip => SessionStorage.setDIreccionIP(ip));
    zip(
      this.comboService.obtenerCombos(),
    ).pipe(map(([combos]) => ({ combos })))
      .subscribe(respuesta => {
        this.comboService.guardarDataCombo(respuesta.combos);
        this.handelVersion(respuesta.combos as unknown as Array<any>);

      });
  }

  private handelVersion(parametros: Array<any>) {
    const result = this.dispositivoService.verificar(parametros);
    if (!result.isCumple) {
      this.cerrarSesionService.logaut().subscribe();
      alert(result.mensaje);
      window.location.assign('http://www.sunat.gob.pe');
    }
  }

  private detenerAutoguardado(evento: NavigationEnd) {
    const det = Rutas.SEC_DETERMINATIVA;
    const inf = Rutas.SEC_INFORMATIVA;
    const rg = new RegExp(`^.*(${det}|${inf}).*$`, 'g');
    // si no es url informativa o determinativa
    if (!rg.test(evento.url)) {
      this.autoGuardadoService.detenerAutoGuardado();
    }
  }

  private clearlistaErrores(evento: NavigationEnd) {
    const det = Rutas.SEC_DETERMINATIVA;
    const inf = Rutas.SEC_INFORMATIVA;
    const rg = new RegExp(`^.*(${det}|${inf}).*$`, 'g');
    // si no es url informativa o determinativa
    if (!rg.test(evento.url)) {
      SessionStorage.setErroresInfo([]);
      SessionStorage.setErroresDetEstados([]);
      SessionStorage.setErroresDet([]);
      SessionStorage.setErroresBackend([]);
      this.chatErrorService.enviarMensaje([], false);
    }
  }
}
