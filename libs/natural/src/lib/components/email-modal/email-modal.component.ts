import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreDeclaracionService } from '../../services/preDeclaracion.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {

  title = 'Reporte Preliminar';
  emailReporte = '';
  emailInvalido = false;
  excepcion = '';
  emailValido = false;
  emailProceso = false;
  emailSending = '';
  emailMessage = '';
  arrayCorreosValidados = [];
  @Input() esPreliminar = true;
  @Input() numeroOrden: any;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbActiveModal,
    private modalServiceReport: NgbModal,
    private preDeclaracionService: PreDeclaracionService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {
  }
  close() {
    this.activeModal.close();
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
      if (this.evaluarDireccion(x) == 1 && x.length <= 50) {
        this.emailInvalido = false;
      } else {
        emailReporteArrayError.push(x);
        error = true;
      }
    });
    if (error) {
      this.emailInvalido = true;
      if (emailReporteArrayError.length === 1) {
        this.excepcion = 'Correo electrónico [' + emailReporteArrayError[0] + '] no es válido';
      } else if (emailReporteArrayError.length === 0) {
        this.excepcion = 'Correo electrónico no es válido';
      } else {
        mostrarError += 'Los correos electrónicos';
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

    const listaPalabrasProhibidas = new Array(
      'no+tengo+correo',
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

        if (dominio.toUpperCase() == 'HOTMAIL.COM.PE') { // no deben terminar en ".com.pe" informacion incorrecta
          return validado = 3;
        }
      }

      // valida si las palabras prohibidas
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < listaPalabrasProhibidas.length; i++) {
        const item1 = listaPalabrasProhibidas[i];
        if (nombre.toUpperCase() == item1.toUpperCase()) {
          return validado = 3;
        }
      }
      const dominioNew = dominio.split('.');
      let subDominio = dominioNew[0];

      for (let i = 0; i < listaPalabrasProhibidas.length; i++) {
        const item2 = listaPalabrasProhibidas[i];
        if ((i === 6 || i === 7) && dominio.length > 14) { subDominio = dominio.substring(0, 15); }
        if (subDominio.toUpperCase() == item2.toUpperCase()) {
          return validado = 3;
        }
      }

      const item = listaPalabrasProhibidas[7];
      if (dominio.length > 15) {
        if (dominio.substring(0, 15).toUpperCase() == item.toUpperCase()) {
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
    if (this.esPreliminar) {
      this.preDeclaracionService.enviarPreDeclaracionSimple_MA_PPNN(correoArray).subscribe(
        data => {
          this.emailProceso = false;
          this.emailMessage = 'Correo enviado correctamente';
          this.emailValido = true;
          this.spinner.hide();
        }, () => {
          this.emailProceso = false;
          this.excepcion = 'Ocurrió un error procesando su solicitud';
          this.emailInvalido = true;
          this.spinner.hide();
        }
      );
    } else {
      this.preDeclaracionService.enviarPreDeclaracionSimple_PPNN(correoArray, this.numeroOrden).subscribe(
        data => {
          this.emailProceso = false;
          this.emailMessage = 'Correo enviado correctamente';
          this.emailValido = true;
          this.spinner.hide();
        }, () => {
          this.emailProceso = false;
          this.excepcion = 'Ocurrió un error procesando su solicitud';
          this.emailInvalido = true;
          this.spinner.hide();
        }
      );
    }


  }
  cancelarEmail($event) {
    this.activeModal.close();
  }
}
