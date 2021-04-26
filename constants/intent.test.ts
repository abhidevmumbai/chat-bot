import { DataService } from '../services';
import { Intents } from '.';

describe('`Intent`', () => {
    it('should set data from Movies Intent', () => {
        const data = { type: 'movie' };
        const intentsSpy = jest.spyOn(Intents.Movies, 'setData');
        const dataServiceSpy = jest.spyOn(DataService, 'set');

        Intents.Movies.setData(data);
        expect(intentsSpy).toHaveBeenCalledWith(data);
        expect(dataServiceSpy).toHaveBeenCalledWith('type', 'movie');
    });

    it('should set data from GetMovies Intent', () => {
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
});
