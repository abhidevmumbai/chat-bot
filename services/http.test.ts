import axios from "axios";
import { Http } from "./http";
jest.mock('axios');

describe('`Http Service`', () => {

    it('should offer `getWeatherByLocation`', () => {
        expect(Http.getWeatherByLocation).toBeDefined();
    });

    it('should get weather by location', async () => {
        const weather = await Http.getWeatherByLocation('Toronto');
        const temperature = '15';

        axios.request = jest.fn()
            .mockImplementationOnce(() => Promise.resolve({ data: { main: { temp: temperature } } }));
        expect(weather).toEqual(temperature);
    });
});