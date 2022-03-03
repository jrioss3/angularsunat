import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoReporte, ReporteGuardarSolicitud } from '@rentas/shared/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteGuardarEnviarService } from '../../service/reporte-guardar-enviar.service';

@Component({
  selector: 'rentas-reporte-enviar-correo',
  templateUrl: './reporte-enviar-correo.component.html',
  styleUrls: ['./reporte-enviar-correo.component.css']
})
export class ReporteEnviarCorreoComponent implements OnInit {

  @Input() tipoReporte: TipoReporte;
  @Input() url: string;
  @Input() solicitud: ReporteGuardarSolicitud;

  emailReporte = '';
  emailInvalido = false;
  excepcion = '';
  emailValido = false;
  emailProceso = false;
  emailSending = '';
  emailMessage = '';
  arrayCorreosValidados = [];

  constructor(
    public modalService: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private rptGuardarEnviarService: ReporteGuardarEnviarService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close();
  }

  validarEmail(event) {
    this.emailValido = false;
    this.emailInvalido = false;
    this.emailProceso = false;

    const emailReporteArray = this.emailReporte.toLowerCase().replace(/ /g, '').split(',');
    const emailReporteArrayError = [];
    let error = false;
    let mostrarError = '';
    emailReporteArray.map(x => {
      if (this.evaluarDireccion(x) === 1 && x.length <= 50) {
        this.emailInvalido = false;
      } else {
        emailReporteArrayError.push(x);
        error = true;
      }
    });

    if (error) {
      this.emailInvalido = true;
      if (emailReporteArrayError.length === 1) {
        this.excepcion = 'El Correo electrónico [' + emailReporteArrayError[0] + '] no es válido';
      } else {
        mostrarError += 'Los correos electrónicos ';
        emailReporteArray.map(x => {
          mostrarError += '[' + x + ']';
        }
        );
        mostrarError += ' no son válidos';
        this.excepcion = mostrarError;
      }
    } else {
      this.arrayCorreosValidados = emailReporteArray;
      this.aceptarEmail();
    }
  }

  evaluarDireccion(entry) {

    let myRegExp = /\b(^(\S+@).+((\.gob)|(\.com)|(\.net)|(\.edu)|(\.mil)|(\.gov)|(\.biz)|(\.org)|(\..{2,15}))$)\b/gi;
    let validado = 0;  // 0 FALSO, 1 OK, 2 OK pero se exige minimo 5 caracteres
    const submail = entry.split('@');
    const nombre = submail[0];
    const dominio = submail[1];

    const listaPalabrasProhibidas = new Array('no+tengo+correo',
      'no+tengo+coreo',
      'no_tengo_coreo',
      'no_tengo_correo',
      'no-tengo-correo',
      'no-tengo-coreo',
      'no.tengo.coreo',
      'no.tengo.correo');

    if (nombre.length < 3) {
      return validado = 2;
    }

    if (myRegExp.test(entry)) {
      validado = 1;
      myRegExp = /((\S+@gmail)|(\S+@hotmail)|(\S+@yahoo)|(\S+@terra)|(\S+@latinmail)|(\S+@outlook))\b/gi;
      if (myRegExp.test(entry)) {

        if (dominio.toUpperCase() === 'HOTMAIL.COM.PE') { // no deben terminar en ".com.pe" informacion incorrecta
          return validado = 3;
        }
      }

      // valida si las palabras prohibidas
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < listaPalabrasProhibidas.length; i++) {
        const objeto = listaPalabrasProhibidas[i];
        if (nombre.toUpperCase() === objeto.toUpperCase()) {
          return validado = 3;
          break;
        }
      }

      const dominioNew = dominio.split('.');
      let subDominio = dominioNew[0];

      for (let i = 0; i < listaPalabrasProhibidas.length; i++) {
        const objeto = listaPalabrasProhibidas[i];
        if ((i === 6 || i === 7) && dominio.length > 14) { subDominio = dominio.substring(0, 15); }
        if (subDominio.toUpperCase() === objeto.toUpperCase()) {
          return validado = 3;
          break;
        }
      }

      const item = listaPalabrasProhibidas[7];
      if (dominio.length > 15) {
        if (dominio.substring(0, 15).toUpperCase() === item.toUpperCase()) {
          return validado = 3;
        }
      }
      if (subDominio.length < 2) { // subdominio no  debe tener menos de 2 caracteres
        return validado = 2;
      }
    }
    return validado;
  }

  aceptarEmail() {
    const correoArray = this.arrayCorreosValidados; // [correo];
    this.emailProceso = true;
    this.emailSending = 'El reporte solicitado se está procesando...';
    this.spinner.show();

    this.solicitud.correos = correoArray;

    this.rptGuardarEnviarService.enviar(this.url, this.solicitud).subscribe(
      _data => {
        this.emailProceso = false;
        this.emailMessage = 'Correo enviado correctamente';
        this.emailValido = true;
        this.spinner.hide();
      },
      _error => {
        this.emailProceso = false;
        this.excepcion = 'Ocurrió un error procesando su solicitud';
        this.emailInvalido = true;
        this.spinner.hide();
      }
    );

  }

  cancelarEmail() {
    this.modalService.close();
  }

  obtenerTitulo() {
    if (this.tipoReporte === TipoReporte.PRELIMINAR) {
      return 'Reporte Preliminar';
    } else if (this.tipoReporte === TipoReporte.DEFINITIVO) {
      return 'Reporte Definitivo';
    }
  }

}
