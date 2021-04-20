import { Data, DataService, HelperService, HttpService } from '../services';

import { StateTypes } from '../enums';

export const MovieMenuState = {
    Genres: {
        type: StateTypes.Question,
        before: async () => {
            let genres = await HttpService.getMovieGenres();
            // Todo: Handle null/error response
            DataService.set('genres', genres);
            return;
        },
        text: () => {
            let genres = DataService.get('genres');
            genres = genres.map((item) => item.name).join(', ');
            const reply = HelperService.getRandomReply('Genre');
            return `${reply}. Pick something from "${genres}"`;
        },
        after: (state) => {
            DataService.set('selectedGenre', state.answer);
            // Todo: check if the genre entered is correct
        },
    },
    Actor: {
        type: StateTypes.Question,
        text: () => HelperService.getRandomReply('Actor'),
        after: async (state) => {
            const selectedActor = await HttpService.getActorIdByName(
                state.answer
            );
            // Todo: Handle null/error response
            DataService.set('selectedActor', selectedActor);
        },
    },
    MovieList: {
        type: StateTypes.Statement,
        before: async () => {
            const selectedGenre = DataService.get('selectedGenre');
            const selectedActor = DataService.get('selectedActor');
            const movies = await HttpService.getMovieRecommendations(
                selectedGenre.id,
                selectedActor.id
            );
            // Todo: Handle null/error response
            DataService.set('movies', movies);
            return;
        },
        text: () => {
            let movies = DataService.get('movies');
            movies = movies.map((item) => item.original_title).join(', ');
            return `The movies are "${movies}"`;
        },
    },
    MoreMovies: {
        type: StateTypes.Question,
        next: 'MovieList',
        text: () => {
            const movies = DataService.get('movies');
            return `The movies are "${movies}"`;
        },
        after: () => {
            let currentPage = DataService.get('currentPage');
            DataService.set('currentPage', currentPage++);
        },
    },
    StartOver: {
        type: StateTypes.Question,
        next: 'Genres',
        text: () => HelperService.getRandomReply('StartOver'),
        after: (state) => {
            DataService.set('startOver', state.answer);
        },
    },
};
