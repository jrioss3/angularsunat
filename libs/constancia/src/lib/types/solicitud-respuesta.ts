export interface SolicitudRespuesta {
    pedidoFraccionamiento: PedidoFraccionamiento;
    codigo:                number;
    mensaje:               string;
}

export interface PedidoFraccionamiento {
    Fec_ped_deu:     Date;
    Fec_fin_des:     Date;
    Fec_des_pln:     Date;
    Fec_fin_car:     Date;
    Fec_car_pln:     Date;
    Fec_val_pln:     Date;
    Fec_con_req:     Date;
    Fec_sol:         Date;
    Fec_fin_pdes:    Date;
    Fec_fin_pval:    Date;
    Fec_anulacion:   Date;
    num_pro:         string;
    num_ruc:         string;
    ind_entidad:     string;
    cod_dep:         string;
    fec_ped_deu:     number;
    fec_fin_des:     number;
    fec_des_pln:     number;
    fec_fin_car:     number;
    fec_car_pln:     number;
    fec_val_pln:     number;
    fec_con_req:     number;
    fec_sol:         number;
    cod_est_ped:     string;
    cod_est_car:     string;
    cod_val_req:     string;
    nom_archivo:     string;
    num_exp_fra:     string;
    des_observacion: string;
    cod_usu:         string;
    fec_fin_pdes:    number;
    fec_fin_pval:    number;
    fec_anulacion:   number;
    cod_tip_doc:     string;
    ind_ori_pro:     string;
    ctd_int_pro:     number;
}