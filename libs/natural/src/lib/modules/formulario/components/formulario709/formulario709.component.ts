import { ModalReintentoComponent } from './../modal-reintento/modal-reintento.component';
import { ReprocesoComponent } from './../reproceso/reproceso.component';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreDeclaracionService } from '@path/natural/services/preDeclaracion.service';
import { PreDeclaracionModel } from '@path/natural/models/preDeclaracionModel';
import { ConsultaDeclaracionesService, ErroresService, InteresMoratorioService, ModalConfirmarService } from '@rentas/shared/core';
import { ParametrosFormularioService } from '@path/natural/services/parametrosFormulario.service';
import { OptionSelect } from '@path/natural/models/optionSelect';
import { ConstantesParametros } from '@path/natural/utils/constantesParametros';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalRucComponent } from '../seteoRUC/modal-ruc.component';
import { environment } from '@rentas/shared/environments';
import { throwError, zip, Observable, EMPTY, of, from } from 'rxjs';
import { ListaParametrosModel } from '@path/natural/models';
import { UtilsComponent } from '@path/natural/components';
import { GeneralesIndicadorRentaModel } from '../../../../models/Generales/generalesIndicadorRentaModel';
import { InicializadorService, MostrarMensajeService } from '@path/natural/services';
import { EjercicioAnterior } from '@path/natural/services/ejercicio-anterior.services';
import { ConstantesMensajesInformativos } from '../../../../utils/constantesMensajesInformativos';
import { ConstantesCadenas, ConstantesTributos, MensajeGenerales, Rutas } from '@rentas/shared/constantes';
import { ConstantesFormulario } from '@rentas/shared/constantes';
import { SessionStorage, FuncionesGenerales } from '@rentas/shared/utils';
import { TipoCasillaService, PagosPreviosService, ComboService, CasillaService } from '@rentas/shared/core';
import { UserData } from '@rentas/shared/types';



@Component({
  selector: 'app-formulario709',
  templateUrl: './formulario709.component.html',
  styleUrls: ['./formulario709.component.css'],
})
export class Formulario709Component implements OnInit, AfterViewInit {
  preDeclaracion: PreDeclaracionModel;
  GeneralesIndicadorRentaModel: GeneralesIndicadorRentaModel;
  //formulario: Formulario;
  listaAnioEjercicio: OptionSelect[];
  userData: UserData;
  rucPN20: ListaParametrosModel[];
  modalOption: NgbModalOptions = {};
  aux = 0;
  //private ejercicioVigente: number;
  public formularioPPNN: any;
  private funcionesGenerales: FuncionesGenerales;
  public mostrarAlerta: boolean;  
  public cboEjercicio : any = 0;  
  private preDeclaracionObject: PreDeclaracionModel;
  private mensajeBienvenida: string[];
  public mensajeInformativo:string;
  

  constructor(
    private router: Router,
    private preDeclaracionService: PreDeclaracionService,
    private errorService: ErroresService,
    private casillaService: CasillaService,
    private comboService: ComboService,
    private inicializadorService: InicializadorService,
    private parametrosFormularioService: ParametrosFormularioService,
    private spinner: NgxSpinnerService,
    private tipoCasillaService: TipoCasillaService,
    private modalService: NgbModal,
    private ejercicioAnterior: EjercicioAnterior,
    private mostrarMensaje: MostrarMensajeService,
    private pagosPreviosService: PagosPreviosService,
    private interesMoratorioService: InteresMoratorioService,
    private modalConfirmarService: ModalConfirmarService,
    private consultaDeclaraciones: ConsultaDeclaracionesService,
  ) {}

  ngOnInit() {
    
    this.spinner.show();
    this.mostrarAlerta = true;
    this.cargarTipoCasilla();
    this.funcionesGenerales = FuncionesGenerales.getInstance();
    zip(
      this.parametrosFormularioService.getDatosCabeceraFormulario(),
      this.parametrosFormularioService.getFechaServidor(),
      this.esperarQuecargeCombo()
    )
      .pipe(
        map(([cabecera, fecha, bool]) => ({cabecera, fecha, bool })),
        catchError((error) => { this.spinner.hide(); return throwError(error)})
      )
      .subscribe((data) => {
        if (data) {
          this.getFormularioCabecera(data.cabecera);
          this.rucPN20 = this.comboService.obtenerComboPorNumero('R06');
          this.validarIngreso();
          SessionStorage.setFechaServidor(data.fecha);
          this.spinner.hide();
        }
      });

    this.validarFecha();
    this.mostrarAlerta=false;
    this.mensajeInformativo="";
    this.obtenerMensajeInicio();  
  }

  ngAfterViewInit(): void {
    if (environment.activar_modal) {
     // setTimeout(() => this.openModal(), 100);
    }
  }

  private cargarTipoCasilla(): void {
    this.tipoCasillaService.cargarTiposCasilla().subscribe((listTipoCasilla) => {
      SessionStorage.setTipoCasillas(listTipoCasilla);
    });
  }

  private esperarQuecargeCombo() {
    const promesa = new Promise((resolve, reject ) => {
        const id = setInterval(() => {
          const combo = SessionStorage.getCombos();
          if( combo !== null && combo.length > 0) {
            resolve(true);
            clearInterval(id);
          }
        },200);
    });
    return from(promesa);
  }

  private validarIngreso(): void {
    this.listaAnioEjercicio = this.parametrosFormularioService.obtenerListaOpciones(
      this.formularioPPNN
    );
    
    this.userData = SessionStorage.getUserData()
    const ruc20 = this.rucPN20.filter(
      (x) => x.val === this.userData.numRUC.toString()
    );
    if (
      this.userData.numRUC.toString().substring(0, 2) === '20' &&
      ruc20.length === 0
    ) {
      this.aceptarMensajeInformativo().subscribe((resp) => {
        if (resp === 'si') {
          window.location.assign('http://www.sunat.gob.pe');
        }
      });
    }
  }

  

  openModal() {
    // SETEO RUC
    const modalRef = this.modalService.open(
      ModalRucComponent,
      this.funcionesGenerales.getModalOptions({})
    );
  }

  public cambiarEjercicio(anioEjercicio:any): void {    
    this.mensajeBienvenida = [];
    if (this.existe(anioEjercicio)) {
      let userDatos: UserData;
      userDatos = SessionStorage.getUserData();     
      this.spinner.show();
      this.cargarPreDeclaracion(userDatos.numRUC, anioEjercicio).subscribe(
        data => {
          this.preDeclaracionObject = data;
          this.esEjercicioVigente(anioEjercicio).pipe(
            tap((bool) =>
              bool
                ? this.showMessageEjercicioNoVigente(userDatos, anioEjercicio)
                : this.showMessageEjercicioVigente(userDatos, anioEjercicio)
            )
          ).subscribe();
        }, () => {
          this.spinner.hide();
        });
    }
  } 

  private existe(anioEjercicio): boolean {
    return anioEjercicio != null && anioEjercicio !== '' && anioEjercicio !== '0';
  }

  private cargarPreDeclaracion(ruc: string, anio: string): Observable<any> {
    return this.preDeclaracionService.cargarPreDeclaracion(ruc, anio /*, '0'*/).pipe(
      catchError((error) => this.handelError(error, ruc, anio)),
      tap((resp) => {
        SessionStorage.setPreDeclaracion(resp);
        //console.log("declaracion",resp)
        // sessionStorage.removeItem(ConstantesStores.STORE_PREDECLARACION);
      })
    );
  }

  private handelError(error: any, ruc, anio): Observable<any> {
    if (error.status === 422 && error.error.errors[0].cod == '42206') {
      this.spinner.hide();
      const lista = error.error.errors as Array<{ cod: string; msg: string }>;
      return this.mensasjeReproceso(lista.shift().msg).pipe(
        switchMap((resp) => {
          this.spinner.show();
          if (resp === 'SI') {
            return this.preDeclaracionService.cargarPreDeclaracion(ruc, anio, '1');
          }
          return this.preDeclaracionService.cargarPreDeclaracion(ruc, anio, '0');
        })
      );
    } else if (error.status === 422 && error.error.errors[0].cod == '42208') {
      this.spinner.hide();
      const lista = error.error.errors as Array<{ cod: string; msg: string }>;
      return this.mensasjeReintento(lista.shift().msg).pipe(
        tap(() => (this.aux = 1)),
        map(() => EMPTY)
      );
    }
    return throwError(error);
  }

  private mensasjeReintento(mensaje: string): Observable<string> {
    const modalRef = this.modalService.open(
      ModalReintentoComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.mensaje = mensaje;
    return modalRef.componentInstance.respuesta;
  }

  private mensasjeReproceso(mensaje: string): Observable<string> {
    const modalRef = this.modalService.open(
      ReprocesoComponent,
      this.funcionesGenerales.getModalOptions({})
    );
    modalRef.componentInstance.mensaje = mensaje;
    return modalRef.componentInstance.eventoRespuesta;
  }

  callModal(excepcionName: string) {
    const modal = {
      titulo: 'Mensaje',
      mensaje: excepcionName,
    };
    const modalRef = this.modalService.open(UtilsComponent, this.modalOption);
    modalRef.componentInstance.modal = modal;
  }

  private aceptarMensajeInformativo(): Observable<any> {
    const modal = {
      titulo: 'Mensaje',
      mensaje: ConstantesMensajesInformativos.MSJ_FORMULARIO_SOLO_PERSONA_NATURAL,
    };
    const modalRef = this.modalService.open(UtilsComponent, this.funcionesGenerales.getModalOptions({}));
    modalRef.componentInstance.nameTab = 'aceptar';
    modalRef.componentInstance.modal = modal;
    return modalRef.componentInstance.respuesta;
  }

  private getFormularioCabecera(dataCabeceraFormulario): void {
    this.formularioPPNN = dataCabeceraFormulario.find(
      (x) => x.codFormulario == ConstantesParametros.COD_FORMULARIO_PPNN
    );
  }

  /* private agregarRutaPadre(listaError){
    return listaError.map(itemError => {
      return {...itemError,url:Rutas.NATURAL + itemError.url};
    });
  } */

  private cargarFormulario(userDatos, anioEjercicio): void {
   
    this.spinner.show();
    zip(
        this.parametrosFormularioService.obtenerDatosFormulario(anioEjercicio),       
        this.errorService.obtenerErrores(anioEjercicio, ConstantesFormulario.NATURAL)/* .pipe(map(this.agregarRutaPadre)) */,
        this.casillaService.obtenerCasillasPN(anioEjercicio),
        this.preDeclaracionService.obtenerIdentificacionBien(
            userDatos.numRUC,
            String(Number(anioEjercicio) - 1)
        )
      )
        .pipe(
          map(
            ([
              respFormulario,             
              respErrores,
              respCasillas,
              respListaBienes,
            ]) => ({
              respFormulario,             
              respErrores,
              respCasillas,
              respListaBienes,
            })
          ),
          catchError((error) => {
            this.spinner.hide();
            return throwError(error);
          })
        )
        .subscribe((respAll) => {
          if (this.aux === 1) {
            this.aux = 0;
            return;
          }
  
          SessionStorage.setFormulario(respAll.respFormulario);
          SessionStorage.setErrores(respAll.respErrores);
          SessionStorage.setCasillas(respAll.respCasillas);
          SessionStorage.setIdentificacionBien(respAll.respListaBienes);
          this.inicializadorService.inicializarInformativa();
          this.inicializadorService.inicializarDeterminativa();
          this.ejercicioAnterior.setearAlquileresCondominosEjercicioAnterior();
          this.obtenerfactorInteresMoratorio();
          this.spinner.hide();

          this.pagosPreviosService.getTributosPagados()
            .subscribe(SessionStorage.setPagosPrevios);         
             
          this.router.navigate([Rutas.NATURAL_INFORMATIVA]);
        });
        
  }  

  private esEjercicioVigente(ejercicioSeleccionado): Observable<boolean> {
    const ejercicio = this.formularioPPNN.ejercicios.find((y) => Number(y.ejercicio) == Number(ejercicioSeleccionado));
    SessionStorage.setCabeceraFormSele(ejercicio)
    return !ejercicio.esActual ? of(true) : of(false);
  }

  private validarFecha(): void {
    const fechaEstablecida = new Date('02/15/2021');
    const fechaActual = new Date();
    this.mostrarAlerta = fechaEstablecida > fechaActual;
  }

  private showMessageEjercicioNoVigente(userDatos, anioEjercicio): void {   
    this.spinner.hide();
    if (this.preDeclaracionObject.declaracion.generales.cabecera.indRectificatoria === '0') {
      const mensaje = MensajeGenerales.MSJ_NO_DJ_PREVIA.replace(new RegExp('XXXX', 'g'), anioEjercicio);
      this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
        if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
          this.cargarFormulario(userDatos, anioEjercicio);
        } else {
          this.cboEjercicio = '0';
        }
      });
    } else {
      this.spinner.show();
      this.consultaDeclaraciones.obtenerDeclaraciones('709', anioEjercicio).subscribe(
        data => {
          this.spinner.hide();
          const mensaje = MensajeGenerales.MSJ_DJ_PREVIA.replace('XXXX', anioEjercicio).replace('fecha', data[0].fecDeclaracion.split(' ')[0]);
          this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
            if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
              this.cargarFormulario(userDatos, anioEjercicio);
            } else {
              this.cboEjercicio = '0';
            }
          });
        }, () => {
          this.spinner.hide();
        });
    }
  }

  private showMessageEjercicioVigente(userDatos, anioEjercicio): void {   
    this.spinner.hide();
    const mensaje = MensajeGenerales.MSJ_EJERCICIO_VIGENTE.replace(new RegExp('XXXX', 'g'), anioEjercicio);
    this.modalConfirmarService.msgBotonesSINO(mensaje).subscribe(respuesta => {
      if (respuesta === ConstantesCadenas.RESPUESTA_SI) {
        this.cargarFormulario(userDatos, anioEjercicio);
      } else {
        this.cboEjercicio = '0';
      }
    });
  }

  private obtenerfactorInteresMoratorio():void {  
    zip(
     this.interesMoratorioService.obtenerFactorInteresMoratorio(ConstantesTributos.RENTA_CAPITAL.codigo),
     this.interesMoratorioService.obtenerFactorInteresMoratorio(ConstantesTributos.RENTA_2DA_CATEGORIA.codigo),
     this.interesMoratorioService.obtenerFactorInteresMoratorio(ConstantesTributos.RENTA_TRABAJO.codigo)
    )
      .pipe(
        map(([interesMoratPrimera, interesMoratSegunda, interesMoratTrabajo]) =>
         ({interesMoratPrimera, interesMoratSegunda, interesMoratTrabajo })),
        catchError((error) => { this.spinner.hide(); return throwError(error)})
      )
      .subscribe((data) => {
        if (data) {
          const listaInteres=[];
          const interesPrimera={id:ConstantesTributos.RENTA_CAPITAL.codigo, factor: data.interesMoratPrimera.factorInteres };
          const interesSegunda={id:ConstantesTributos.RENTA_2DA_CATEGORIA.codigo, factor: data.interesMoratSegunda.factorInteres };
          const interesTrabajo={id:ConstantesTributos.RENTA_TRABAJO.codigo, factor: data.interesMoratTrabajo.factorInteres };
          listaInteres.push(interesPrimera,interesSegunda, interesTrabajo);        
          SessionStorage.setFactorInteresMoratorioNatural(listaInteres);
          this.spinner.hide();
        }
      });
  }
  private obtenerMensajeInicio(){ 
       
    this.parametrosFormularioService.getMensajeInicial( ConstantesParametros.COD_FORMULARIO_PPNN).
    subscribe((data)=>{
      if(data){
        this.mensajeInformativo=data.mensaje;
        this.mostrarAlerta=true;
      }
    }, () => {
      this.spinner.hide();
    });
    }

 

}
