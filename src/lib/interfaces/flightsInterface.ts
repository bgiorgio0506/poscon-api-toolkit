type callsign =  string | Array<string>;
type operators = string | Array<string>;

export interface IFlightsData {
    ac_type: string;
    callsign: string;
    flightplan : IFlightPlan;
    freq : IRadioStack;
    login : Date;
    position : IPosition;
    squawk : string;
    userId : string;
    userName : string;
}

export interface IFlightFilters{
    callsign : string;
    ac_type : string;
    userId : string;
    userName : string;
    dep : string;
    dest : string;
    
}

export interface IFlightPlan {
    ac_type : string;
    altnt : string;
    altnt2 : string;
    ata : Date; 
    atd : Date;
    callsign : string;
    created : Date;
    cruise : string;
    cruise_spd : string;
    dep: string;
    dep_time : string;
    dest : string;
    dof : Date;
    eet : string;
    endurance : string;
    equip_code : string;
    operator : string;
    other : string;
    pbn : string;
    perf_cat : string;
    persons : number; 
    remarks : string;
    route : string;
    rules : string;
    ssr : string;
    sta : Date; 
    std : Date; 
    type : string;
    updated : Date;
    user : string;
    wake_turb : string;
}

export interface IRadioStack {
    vhf1 : number;
    vhf2 : number;
}

export interface IPosition {
    alt_amsl : number;
    ghosted : boolean;
    gs_kt : number;
    lat : number;
    long : number;
    pitch : number;
    pressure_alt : number;
    roll : number;
    true_hdg : number;
    vertFtPerSec : number;
}

export interface IOptions {                                 
    ac_type? : string;
    callsign? : callsign;
    operator? : operators;
}
