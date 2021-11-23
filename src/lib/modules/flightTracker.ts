import { EventEmitter } from "events";
import {request} from '../helpers/httpApi';
import { FlightData } from "../modules/flighs";

import { ITrackerData } from "../interfaces/trackerInterface";
import { IFlightsData, IOptions, IPosition } from "../interfaces/flightsInterface";
import { AxiosResponse } from "axios";
import { IAirportDistanceResponse, IAirportRequest } from "../interfaces/airportInterface";

export class FlightTracker {
    public callsign : string | Array<string>;
    public interval : number;
    public operator: string | Array<string>;
    public acType: string | Array<string>;
    public currentFlightPhase: string = "BOARDING";
    private eventEmitter: EventEmitter = new EventEmitter();
    private airportApi:string = 'https/api.thecrewbot.it/radar/airports/distance'


    private flightData : FlightData;
    private phases = [
        {
            name: "BOARDING",
            check: (currentData:IPosition, previousData:IPosition, computedData) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDep <
                            computedData.distanceFromDest
                    ) {
                        if (computedData.distanceFromDep <= 10000) {
                            return currentData.gs_kt === 0;
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "TAXI",
            check: (currentData:IPosition, previousData:IPosition, computedData) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDep < computedData.distanceFromDest
                    ) {
                        if (computedData.distanceFromDep <= 10000) {
                            return (
                                currentData.gs_kt > 0 &&
                                currentData.gs_kt < 30
                            );
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "TAKE_OFF",
            check: (currentData:IPosition, previousData:IPosition, computedData) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDep < computedData.distanceFromDest
                    ) {
                        if (computedData.distanceFromDep <= 10000) {
                            return currentData.gs_kt > 60;
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "REJECTED_TAKE_OFF",
            check: (currentData:IPosition, previousData:IPosition, computedData) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDep < computedData.distanceFromDest
                    ) {
                        if (computedData.distanceFromDep <= 10000) {
                            return (
                                this.currentFlightPhase === "TAKE_OFF" &&
                                previousData.gs_kt > currentData.gs_kt &&
                                currentData.gs_kt > 30 &&
                                currentData.gs_kt < 110
                            );
                        }
                    }
                }
                return null;
            },
        },
        {
            name: "CLIMB_OUT",
            check: (currentData:IPosition, previousData:IPosition) => {
                if (currentData.vertFtPerSec > 300) {
                    return currentData.alt_amsl > 0 && currentData.alt_amsl < 8000;
                }
                return false;
            },
        },
        {
            name: "CLIMB",
            check: (currentData:IPosition, previousData:IPosition) => {
                return currentData.vertFtPerSec > 300;
            },
        },
        {
            name: "CRUISE",
            check: (currentData:IPosition, previousData:IPosition, computedData: IAirportDistanceResponse) => {
                return (
                    currentData.vertFtPerSec < 300 &&
                    currentData.vertFtPerSec > -300 &&
                    currentData.alt_amsl >= computedData.cruiseAlt
                );
            },
        },
        {
            name: "DESCENT",
            check: (currentData:IPosition, previousData:IPosition, computedData:IAirportDistanceResponse) => {
                if (currentData.vertFtPerSec < -300) {
                    return (
                        computedData.distanceFromDest > 92000 &&
                        currentData.alt_amsl > 10000
                    );
                }
                return false;
            },
        },
        {
            name: "APPROACH",
            check: (currentData, previousData, computedData) => {
                if (currentData.vs < -300) {
                    return (
                        computedData.distanceFromDest < 92000 &&
                        currentData.altitude < 10000
                    );
                }
                return false;
            },
        },
        {
            name: "FINAL",
            check: (currentData, previousData, computedData) => {
                if (currentData.vs < -300) {
                    return (
                        computedData.distanceFromDest < 14816 &&
                        currentData.flaps > 0
                    );
                }
                return false;
            },
        },
        {
            name: "LANDED",
            check: (currentData:IPosition, previousData:IPosition, computedData:IAirportDistanceResponse) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDep > computedData.distanceFromDest
                    ) {
                        if (Math.round(computedData.distanceFromDep) <= 10000) {
                            return currentData.gs_kt > 60;
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "GO_AROUND",
            check: (currentData:IPosition, previousData:IPosition) => {
                if (currentData.vertFtPerSec > 300) {
                    return (
                        (this.currentFlightPhase === "FINAL" ||
                            this.currentFlightPhase === "LANDED") &&
                        currentData.gs_kt > 170
                    );
                }
                return false;
            },
        },
        {
            name: "TAXI_TO_GATE",
            check: (currentData: IPosition, previousData: IPosition, computedData: IAirportDistanceResponse) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDest < computedData.distanceFromDep
                    ) {
                        if (computedData.distanceFromDest <= 10000) {
                            return (
                                currentData.gs_kt > 0 &&
                                currentData.gs_kt < 30
                            );
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "DEBOARDING",
            check: (currentData:IPosition, previousData:IPosition, computedData:IAirportDistanceResponse) => {
                if (currentData.alt_amsl === 0) {
                    if (
                        computedData.distanceFromDest < computedData.distanceFromDep
                    ) {
                        if (computedData.distanceFromDest <= 10000) {
                            return currentData.gs_kt === 0 && !this.currentFlightPhase;
                        }
                    }
                }
                return false;
            },
        },
        {
            name: "DIVERTED",
            check: (currentData, previousData, computedData) => {
                if (
                    currentData.planeOnground &&
                    computedData.distanceFromDest > 10000 &&
                    computedData.distanceFromDep > 10000
                ) {
                    return true;
                }
                return false;
            },
        },
    ];
    

    constructor(interval:number = 35000 , callsign?:string | Array<string> , operator?:string | Array<string>, acType?:string | Array<string>, ) {
        this.callsign = callsign;
        this.interval = interval;
        this.operator = operator;
        this.acType = acType;
        this.flightData = new FlightData();
    };


    public  async trackFlightPhases(): Promise<void> {
        let savedFlightData = [];
        let flightsReport : Array <ITrackerData> = [];
        let opts: IOptions = {
            callsign: this.callsign,
            operator: this.operator,
        }

        this.flightData.listenFlights(this.interval).subscribe(async(flightsData: Array<IFlightsData>) =>{
            let previousFlightData = savedFlightData;
            savedFlightData = flightsData;
            for await (const flightData of savedFlightData) {
                let comparisionData = previousFlightData.find( (prevData: IFlightsData) => prevData.callsign === flightData.callsign);
                return flightsReport.push(await this.processStatus(flightData, comparisionData));
            }

            if(flightsReport.length > 0) {
                this.eventEmitter.emit('flights-report-update', flightsReport);
            }else {
                this.eventEmitter.emit('flights-report-update', []);
            }


        })
    }

    protected async  processStatus(currentFlightData: IFlightsData, previousFlightData: IFlightsData): Promise<ITrackerData> {
        let previousPositionData = previousFlightData.position;
        let currentPositionData = currentFlightData.position;
        let postData : IAirportRequest = {
            departure : currentFlightData.flightplan.dep,
            arrival : currentFlightData.flightplan.dest,
            lon: currentPositionData.long, 
            lat: currentPositionData.lat,
        }

        let computedData:AxiosResponse= await (await request(this.airportApi, 'POST', postData));
        let computedFlightData:IAirportDistanceResponse = {
            ... computedData.data,
            cruiseAl : parseInt(currentFlightData.flightplan.cruise.substring(1, currentFlightData.flightplan.cruise.length))*100,
        }

        this.currentFlightPhase = this.computeFlightPhase(currentPositionData, previousPositionData, computedFlightData);

        return {
            callsign : currentFlightData.flightplan.callsign,
            status : this.currentFlightPhase,
            position : currentPositionData,
            radioStack : currentFlightData.freq,
            acType : currentFlightData.flightplan.ac_type,
            departure : currentFlightData.flightplan.dep,
            arrival : currentFlightData.flightplan.dest,
            fpType: currentFlightData.flightplan.type,
            userId : currentFlightData.userId,
            squawk : currentFlightData.squawk,
        };
    }


    private computeFlightPhase(currentPositionData: IPosition, previousPositionData: IPosition, computedData:IAirportDistanceResponse): string {
        for (let index = 0; index < this.phases.length; index++) {
            const phase = this.phases[index];
    
            if (phase.check(currentPositionData, previousPositionData, computedData)) {
                return phase.name;
            }
        }
    }

    public on(event: string, listener: any): EventEmitter { 
       return this.eventEmitter.on(event, listener);  
    }
}