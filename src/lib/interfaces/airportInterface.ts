export interface IAirportRequest {
    departure: string;
    arrival: string;
    lon: number;
    lat: number;
    
}

export interface IAirportDistanceResponse {
    distanceFromDep: number;
    distanceFromDest: number;
    departure: string;
    arrival: string;
    cruiseAlt: number;
}