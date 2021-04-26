import { DataService } from '../services';
import { Intents } from '.';

describe('`Intent`', () => {
    describe('`Movies`', () => {
        it('should set Movie type as "movie"', () => {
            const data = { type: 'movie' };
            const intentsSpy = jest.spyOn(Intents.Movies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.Movies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
        });

        it('should set Movie type as "tv"', () => {
            const data = { type: 'shows' };
            const intentsSpy = jest.spyOn(Intents.Movies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.Movies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'tv');
        });
    });

    describe('`GetMovies`', () => {
        it('should set sortBy as vote_average.desc', () => {
            const data = { category: 'top', genre: 'action', year: '2020' };
            const intentsSpy = jest.spyOn(Intents.GetMovies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.GetMovies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith(
                'sortBy',
                'vote_average.desc'
            );
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
            expect(dataServiceSpy).toHaveBeenCalledWith('selectedYear', '2020');
        });

        it('should set sortBy as popularity.desc for "popular" category', () => {
            const data = { category: 'popular', genre: 'action', year: '2020' };
            const intentsSpy = jest.spyOn(Intents.GetMovies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.GetMovies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith(
                'sortBy',
                'popularity.desc'
            );
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
            expect(dataServiceSpy).toHaveBeenCalledWith('selectedYear', '2020');
        });

        it('should set sortBy as popularity.desc for "most popular" category', () => {
            const data = {
                category: 'most popular',
                genre: 'action',
                year: '2020',
            };
            const intentsSpy = jest.spyOn(Intents.GetMovies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.GetMovies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith(
                'sortBy',
                'popularity.desc'
            );
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
            expect(dataServiceSpy).toHaveBeenCalledWith('selectedYear', '2020');
        });

        it('should set type as movie for "movies"', () => {
            const data = {
                category: 'most popular',
                type: 'movies',
                genre: 'action',
                year: '2020',
            };
            const intentsSpy = jest.spyOn(Intents.GetMovies, 'setData');
            const dataServiceSpy = jest.spyOn(DataService, 'set');

            Intents.GetMovies.setData(data);
            expect(intentsSpy).toHaveBeenCalledWith(data);
            expect(dataServiceSpy).toHaveBeenCalledWith(
                'sortBy',
                'popularity.desc'
            );
            expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
            expect(dataServiceSpy).toHaveBeenCalledWith('selectedYear', '2020');
            expect(dataServiceSpy).toHaveBeenCalledWith(
                'selectedGenreName',
                'action'
            );
        });
    });
});
