type AtcDataValues = string | number | boolean | Array<number> | Date;

export interface IAtcData {
    [key: string]: AtcDataValues;
    centerPoint : Array<number>;
    fir : string;
    login : Date;
    position : string; 
    telephony : string;
    type : string;
    userId : string;
    userName : string;
    vhfFreq : string;
}

export interface IAtcDataList {
    data : Array<IAtcData>;
}

export interface IAtcFilter {
    [key: string]: string | undefined;
    fir? : string;
    position? : string;
    telephony? : string;
    type? : string;
    userId? : string;
    userName? : string;
}