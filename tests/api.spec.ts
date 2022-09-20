import { FlightData, AtcData } from '../src/api';
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




