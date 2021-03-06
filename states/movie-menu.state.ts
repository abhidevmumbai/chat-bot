import { DataService, HelperService, HttpService } from '../services';

import { StateTypes } from '../enums';

export const MovieMenuState = {
    Genres: {
        type: StateTypes.Question,
        error: false,
        retry: 'StartOver',
        before: async () => {
            let genres = DataService.get('genres');
            let type = DataService.get('type');
            if (!genres) {
                try {
                    let genres = await HttpService.getMovieGenres(type);
                    DataService.set('genres', genres);
                    MovieMenuState.Genres.error = false;
                } catch (e) {
                    MovieMenuState.Genres.error = true;
                }
            }
            return;
        },
        text: () => {
            if (!MovieMenuState.Genres.error) {
                let genres = DataService.get('genres');
                genres = genres
                    .map((item, index) => `${++index}. ${item.name}`)
                    .join(',\n');
                const reply = HelperService.getRandomReply('Genre');
                return `${reply}. Pick something from: \n${genres}`;
            } else {
                return `Some error occured`;
            }
        },
        after: (state) => {
            DataService.set('selectedGenreName', state.answer);
        },
    },
    Actor: {
        type: StateTypes.Question,
        error: false,
        retry: 'StartOver',
        text: () => HelperService.getRandomReply('Actor'),
        after: async (state) => {
            try {
                const selectedActor = await HttpService.getActorByName(
                    state.answer
                );
                DataService.set('selectedActor', selectedActor);
                MovieMenuState.Actor.error = true;
            } catch (e) {
                MovieMenuState.Actor.error = true;
            }
        },
    },
    WhatMovies: {
        type: StateTypes.Question,
        isIntent: true,
        text: () =>
            'What movies/shows do you like? For example You can ask "top action movies/shows from 2000"',
    },
    GetMovies: {
        type: StateTypes.Statement,
        error: false,
        retry: 'StartOver',
        before: async () => {
            let genres = DataService.get('genres');
            if (!genres) {
                try {
                    let genreList = await HttpService.getMovieGenres();
                    DataService.set('genres', genreList);
                    MovieMenuState.GetMovies.error = false;
                } catch (e) {
                    MovieMenuState.GetMovies.error = true;
                }
            }
            const selectedGenre = HelperService.getSelectedGenre(genres);
            DataService.set('selectedGenre', selectedGenre && selectedGenre);
            const selectedGenreId = selectedGenre ? selectedGenre.id : null;
            const selectedActor = DataService.get('selectedActor');
            const selectedActorId = selectedActor ? selectedActor.id : null;
            const type = DataService.get('type') || null;
            const sortBy = DataService.get('sortBy') || null;
            const selectedYear = DataService.get('selectedYear') || null;
            try {
                const movies = await HttpService.getMovieRecommendations(
                    selectedGenreId,
                    type,
                    selectedActorId,
                    sortBy,
                    selectedYear
                );
                DataService.set('movies', movies);
                MovieMenuState.GetMovies.error = false;
            } catch (e) {
                MovieMenuState.GetMovies.error = true;
            }
            return;
        },
        text: () => {
            let movies = DataService.get('movies');
            if (!MovieMenuState.GetMovies.error && movies && movies.length) {
                movies = movies
                    .map(
                        (item, index) =>
                            `${++index}. ${
                                item.original_title || item.original_name
                            }`
                    )
                    .join(',\n');
                return `Here you go: \n"${movies}"`;
            } else {
                return `Sorry, we couldn't find anything...`;
            }
        },
        after: () => {
            let currentPage = DataService.get('currentPage');
            DataService.set('currentPage', currentPage++);
        },
    },
    StartOver: {
        type: StateTypes.Question,
        isIntent: true,
        next: 'Genres',
        cancel: 'Menu',
        text: () => HelperService.getRandomReply('StartOver'),
        after: (state) => {
            DataService.set('startOver', state.answer);
        },
    },
};
