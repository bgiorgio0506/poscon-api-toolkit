# poscon-api-toolkit

poscon-api-toolkit is a node dependency wirtten to allow easy access to POSCON API.

This package offers: 
- Easy access to ATC and flights data
- Automatic update of flight data
- Automatic parsing for all data 
- Easily controllable update rate


### Disclamer
This package is provided as is. The author is not responsible for any damage caused by using this package. 

## Requirements
you must meet these requirments on your machine:
 - Node 12+

Node API usage requirements:
 - `rxjs` >= 6.5.0

## Get Started
Download the dependency using the following options:
npm : 
```
npm i --save poscon-api-toolkit
```
or yarn: 
```
yarn add poscon-api-toolkit
```

After import, you can use `AtcData, FlightData, FlightTracker` to listen to provided values. 

### Import
SDK is imported using:
`new AtcData` instanciate an AtcData object with no args.
`new FlightData` instanciate a FlightData object with no args.

```typescript
import {AtcData, FlightData} from 'poscon-api-toolkit';
const atcApi = new AtcData();
const flightApi = new FlightData();
```

**options**: 
- Interval type `Number` : time in `ms` passed after each stream update this can be at minimum 35000ms =>  35 seconds. 
- Callsign* is type `String | Array<String>`: a callsign or a series of callsigns that can be tracked.
- operator* type `String | Array<String>`: an operator or a series of operators that can be tracked.
- acType type `String | Array<String>`:  an aircraft type or a series of aircraft types that can be tracked.



### Complete example

```typescript
import { FlightData, AtcData } from 'poscon-api-toolkit';

/* SDK Calls example*/
const flighData = new FlightData();
//get current flights by routes (ex: CTA -> FCO)
const flightsByRoute = await flighData.getFlightsByRoute('LICC', 'LIRF');
//get current flights by operator (ex: EZY)
const flightsByOperator = await flighData.getFlightsByOperator('EZY');
//get current flight by callsign (ex: EZY123)
const flightsByCallsign = await flighData.getFlightsByCallsign('EZY123');
// get All flights
const allFlights = await flighData.getAllFlights();

//get current ATC data
const atcData = new AtcData();

// NOTE All options are optional the data will be fetch according to the options provided.
const options = {
    fir : 'LIRR',
    position : 'LIRR.LICC.TWR.CCT',
    telephony : 'CATANIA TOWER',
    type : 'TWR',
    userId : '1013048',
    userName : 'Some Name',
}

const atcOnline = await atcData.getAtc(options);

//get current ATC by date in ISO format (ex: 2020-01-01T00:00:00.000Z)
const atcOnline = await atcData.getAtcByDate(date);

//get upcoming ATC 
const atcUpcoming = await atcData.getUpcomingAtc();

```
