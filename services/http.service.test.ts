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

    it('should offer `getMovieGenres`', () => {
        expect(HttpService.getMovieGenres).toBeDefined();
    });

    it('should get movies genres', async () => {
        const response = {
            data: {
                genres: [
                    {
                        id: 28,
                        name: 'Action',
                    },
                    {
                        id: 12,
                        name: 'Adventure',
                    },
                    {
                        id: 16,
                        name: 'Animation',
                    },
                    {
                        id: 35,
                        name: 'Comedy',
                    },
                ],
            },
        };
        const mock = jest.spyOn(axios, 'request');
        mock.mockReturnValueOnce(Promise.resolve(response));
        const genres = await HttpService.getMovieGenres();
        expect(genres).toEqual(response.data.genres);
    });

    it('should offer `getActorIdByName`', () => {
        expect(HttpService.getActorIdByName).toBeDefined();
    });

    it('should get actor id by name', async () => {
        const name = 'Jim Carrey';
        const response = {
            data: { results: [{ name: 'Jim Carrey', id: 206 }] },
        };
        const mock = jest.spyOn(axios, 'request');
        mock.mockReturnValueOnce(Promise.resolve(response));
        const actor = await HttpService.getActorIdByName(name);
        expect(actor).toEqual(response.data.results[0]);
    });

    it('should offer `getMovieRecommendations`', () => {
        expect(HttpService.getMovieRecommendations).toBeDefined();
    });

    it('should get weather by location', async () => {
        const genreId = 28;
        const actorId = 206;
        const response = {
            data: {
                results: [{ original_title: 'Sonic the Hedgehog', id: 454626 }],
            },
        };
        const mock = jest.spyOn(axios, 'request');
        mock.mockReturnValueOnce(Promise.resolve(response));
        const movies = await HttpService.getMovieRecommendations(
            genreId,
            actorId
        );
        expect(movies).toEqual(response.data.results);
    });
});
