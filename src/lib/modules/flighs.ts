import { timer, from, Observable, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators'; 
import { IlligalArgumentError, RuntimeExepctionError } from '../helpers/errors';


import { request } from "../helpers/httpApi";
import { filterByRules } from '../helpers/utils';
import { IFlightsData, IOptions } from "../interfaces/flightsInterface";

export class FlightData {
    private url: string = 'https://hqapi.poscon.net/online.json';

    /**
     * Get flight data from the API
     */
    public async getAllFlights(): Promise<Array<IFlightsData>> {
        return await (await request(this.url, 'GET')).data.flights;
    }

    public async getFlightsByRoute(dep: string, dest: string): Promise<Array<IFlightsData>> {
        return await (await (await request(this.url, 'GET')).data.flights).filter((flight:IFlightsData) =>
            flight.flightplan.dep === dep && flight.flightplan.dest === dest);
    }

    public async getFlightByOperator(operator: string): Promise<Array<IFlightsData>> {
        return await (await (await request(this.url, 'GET')).data.flights).filter((flight:IFlightsData) =>
            flight.flightplan.operator === operator);
    }

    public async getFlightByCallsign(callsign: string): Promise<Array<IFlightsData>> {
        return await (await (await request(this.url, 'GET')).data.flights).filter((flight:IFlightsData) =>
            flight.callsign === callsign);
    }

    public listenFlights(interval:number , opts:IOptions = {} ): Observable<Array<IFlightsData>> {
        if (interval< 35000) throw new IlligalArgumentError('Interval must be at least 35000ms or grater');

        return timer(interval, interval).pipe(
            switchMap(() => {
                return from(this.getAllFlights()).pipe(
                    map((flights: Array<IFlightsData>) => {
                      return filterByRules(opts, flights);
                    }),
                    catchError(() => {
                        return throwError(() => new RuntimeExepctionError('Failed to pipe data'));
                    })
                );
            })
        );
    }


}
