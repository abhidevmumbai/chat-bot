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

    async getWeatherByLocation(location: string): Promise<string> {
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

    async getMovieGenres(type = 'movie'): Promise<Genre> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/genre/${type}/list`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
            },
        };

        const response = await axios.request(options);
        let genres = response.data.genres;
        return genres;
    }

    async getActorByName(name: string): Promise<Actor> {
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
        type = 'movie',
        actorId = null,
        sortBy = 'popularity.desc',
        year = null
    ): Promise<MovieList> {
        const limit = 10;
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.movieApi.url}/3/discover/${type}`,
            params: {
                api_key: this.movieApi.key,
                language: this.movieApi.language,
                sort_by: sortBy,
                with_cast: actorId,
                with_genres: genreId,
                primary_release_year: year,
                page: 1,
            },
        };

        const response = await axios.request(options);
        let movies = response.data.results;
        return movies.length > limit ? movies.slice(0, limit) : movies;
    }
}

export const HttpService = new Http();
