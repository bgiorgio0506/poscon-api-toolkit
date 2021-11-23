import { AxiosResponse } from "axios";
import { request } from "../helpers/httpApi";
import { IAtcData, IAtcDataList, IAtcFilter } from "../interfaces/atcInterface";

export class AtcData {
    
    private url: string = 'https://hqapi.poscon.net/online.json';
  
    public async getAtcData(filters : IAtcFilter): Promise<IAtcDataList> {
        let atcFilterList: Array<IAtcData> = [];
        let atcOnlineData: AxiosResponse = await request(this.url , 'GET');
         if (atcOnlineData.data.atc.length === 0) return {data : [] };
         else {
             let filtersKey = Object.keys(filters);
             for ( let i = 0; i < filtersKey.length; i++) {
                 if (Object.prototype.hasOwnProperty.call(filters, filtersKey[i])) {
                       const filterResult = atcOnlineData.data.atc.filter( (atc:IAtcData )=> atc[filtersKey[i]] === filters[filtersKey[i]]);
                        atcFilterList = atcFilterList.concat(filterResult);
                 } else continue
             }
             return {data : atcFilterList};
         }
    }

    public async getUpcomingAtcData(): Promise<IAtcDataList> {
        return { data : await(await request(this.url , 'GET')).data.upcomingAtc};
    }

    public async getAtcDataByDate(date: string): Promise<IAtcDataList> {
        return { data : await (await request(this.url , 'GET')).data.atc.filter( (atc:IAtcData )=> atc.login.toString().substring(0, 10) === date)};
    }

}