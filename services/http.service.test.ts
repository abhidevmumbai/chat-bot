import axios from 'axios';
import { HttpService } from './http.service';
jest.mock('axios');

describe('`Http Service`', () => {
    it('should offer `getWeatherByLocation`', () => {
        expect(HttpService.getWeatherByLocation).toBeDefined();
    });

    it('should get weather by location', async () => {
        const weather = await HttpService.getWeatherByLocation('Toronto');
        const temperature = '15';

        axios.request = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { main: { temp: temperature } } })
            );
        expect(weather).toEqual(temperature);
    });
});
