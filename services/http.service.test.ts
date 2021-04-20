import axios, { AxiosResponse } from 'axios';
import { HttpService } from './http.service';

describe('`Http Service`', () => {
    it('should offer `getWeatherByLocation`', () => {
        expect(HttpService.getWeatherByLocation).toBeDefined();
    });

    it('should get weather by location', async () => {
        const temperature = '15';
        const response = {
            data: { main: { temp: temperature } },
        };
        const mock = jest.spyOn(axios, 'request');
        mock.mockReturnValueOnce(Promise.resolve(response));
        const weather = await HttpService.getWeatherByLocation('Toronto');
        expect(weather).toEqual(temperature);
    });
});
