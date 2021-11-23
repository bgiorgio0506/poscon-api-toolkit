import { IPosition, IRadioStack , IFlightPlan } from "./flightsInterface";

export interface ITrackerData {
    callsign: string;
    status: string;
    position: IPosition;
    radioStack: IRadioStack;
    squawk: string;
    userId: string;
    acType: string;
    departure: string;
    arrival: string;
    fpType : string;
}