import { FlightData, AtcData, FlightTracker } from '../src/api';
import { request} from '../src/lib/helpers/httpApi';

const HttpClientError = jest.fn().mockImplementation(() => ({
    name: 'HttpClientError',
    code: 403,
    message: 'some message'
}));

describe(' Atc instance', () => {
    it('should create an instance', () => {
        const instance = new AtcData()
        expect(instance).toBeTruthy();
    })
}); 

describe('Flights instance', () => {
    it('should create an instance', () => {
        const instance = new FlightData(); 
        expect(instance).toBeTruthy();
    })
}); 

describe('Flight Tracker instance', () => {
    it('should create an instance', () => {
        const instance = new FlightTracker(); 
        expect(instance).toBeTruthy();
        expect(instance['interval']).toBeDefined();
    })
})

describe('Should make request', () => {
    it ('should make request', async() => {
        const response = await request('https://api.thecrewbot.it/radar','GET');
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });

    it ('should make request with error', async() => {
        try {
            await request('https://api.thecrewbot.it/radar/airports/distance','GET');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('should make a post request with data', async () => {
        const response = await request('https://api.thecrewbot.it/radar/airports/distance','POST', {
            departure : 'LIRF',
            arrival : 'LICC',
            lon : 13.0442007,
            lat :40.3946356
        })
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.distanceFromDep).toBeDefined();
        expect(response.data.distanceFromArr).toBeGreaterThan(response.data.distanceFromDep);
    });

})

