import { Actor, Genre, MovieList } from '../models';
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

    async getWeatherByLocation(location): Promise<string> {
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

    async getMovieGenres(): Promise<Genre> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/genre/movie/list`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
            },
        };

        const response = await axios.request(options);
        let genres = response.data.genres;
        return genres;
    }

    async getActorByName(name): Promise<Actor> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/search/person`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
                query: name,
                page: 1,
            },
        };

        const response = await axios.request(options);
        let actor = response.data.results.length
            ? {
                  name: response.data.results[0].name,
                  id: response.data.results[0].id,
              }
            : null;
        return actor;
    }

    async getMovieRecommendations(
        genreId = null,
        actorId = null
    ): Promise<MovieList> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/discover/movie`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
                sort_by: 'popularity.desc',
                with_cast: actorId,
                with_genres: genreId,
                page: 1,
            },
        };

        const response = await axios.request(options);
        let movies = response.data.results;
        return movies;
    }
}

export const HttpService = new Http();
