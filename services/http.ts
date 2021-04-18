import axios, { AxiosRequestConfig } from 'axios';

class HttpService {
    constructor() {}

    async getWeatherByLocation(location) {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            params: {
                q: location,
                units: 'metric',
            },
            headers: {
                'x-rapidapi-key':
                    '17e5d1c9a4msh9626219b27e0824p1a0965jsn0f56fbb373c6',
                'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
            },
        };

        const response = await axios.request(options);
        return response.data.main.temp;
    }
}

export const Http = new HttpService();
