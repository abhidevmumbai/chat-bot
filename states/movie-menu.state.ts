import { DataService, HelperService, HttpService } from '../services';

import { StateTypes } from '../enums';

export const MovieMenuState = {
    Genre: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Genre'),
        after: (state) => {
            DataService.set('genre', state.answer);
        },
    },
    Genres: {
        type: StateTypes.Statement,
        next: 'Menu',
        before: async () => {
            const genres = await HttpService.getMovieGenres();
            DataService.set('genres', genres);
            return;
        },
        text: () => {
            const genres = DataService.get('genres');
            return `The movie genres are "${genres}"`;
        },
    },
    Actor: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Actor'),
        after: (state) => {
            DataService.set('actor', state.answer);
        },
    },
    StartOver: {
        type: StateTypes.Question,
        next: 'MovieMenu',
        no: 'Menu',
        text: () => HelperService.getRandomReply('StartOver'),
        after: (state) => {
            DataService.set('startOver', state.answer);
        },
    },
};
