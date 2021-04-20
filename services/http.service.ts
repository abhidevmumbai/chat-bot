import axios, { AxiosRequestConfig } from 'axios';

class Http {
    private weatherAPI;
    private movieApi;

    constructor() {
        this.weatherAPI = {
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            key: '17e5d1c9a4msh9626219b27e0824p1a0965jsn0f56fbb373c6',
            host: 'community-open-weather-map.p.rapidapi.com',
        };
        this.movieApi = {
            url: 'https://api.themoviedb.org',
            key: 'd27343ea256fcb2b0be1c09ae5363957',
            language: 'en-US',
        };
    }

    async getWeatherByLocation(location) {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: this.weatherAPI.url,
            params: {
                q: location,
                units: 'metric',
            },
            headers: {
                'x-rapidapi-key': this.weatherAPI.key,
                'x-rapidapi-host': this.weatherAPI.host,
            },
        };

        const response = await axios.request(options);
        return response.data.main.temp;
    }

    async getMovieGenres() {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/genre/movie/list`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
            },
        };

        const response = await axios.request(options);
        let genres = response.data.genres.map((item) => item.name);
        return genres.join(', ');
    }
}

export const HttpService = new Http();
