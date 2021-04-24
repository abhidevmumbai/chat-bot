import { DataService, HelperService, HttpService } from '../services';

import { StateTypes } from '../enums';

export const MovieMenuState = {
    Genres: {
        type: StateTypes.Question,
        error: false,
        retry: 'StartOver',
        before: async () => {
            let genres = DataService.get('genres');
            if (!genres) {
                try {
                    let genres = await HttpService.getMovieGenres();
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
                    .map((item, index) => `${index}. ${item.name}`)
                    .join(',\n');
                const reply = HelperService.getRandomReply('Genre');
                return `${reply}. Pick something from: \n"${genres}"`;
            } else {
                return `Some error occured`;
            }
        },
        after: (state) => {
            DataService.set('selectedGenre', state.answer);
            // Todo: check if the genre entered is correct
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
    MovieList: {
        type: StateTypes.Statement,
        error: false,
        retry: 'StartOver',
        before: async () => {
            const selectedGenre = DataService.get('selectedGenre');
            const selectedActor = DataService.get('selectedActor');
            try {
                const movies = await HttpService.getMovieRecommendations(
                    selectedGenre.id,
                    selectedActor.id
                );
                DataService.set('movies', movies);
                MovieMenuState.MovieList.error = false;
            } catch (e) {
                MovieMenuState.MovieList.error = true;
            }

            return;
        },
        text: () => {
            if (!MovieMenuState.MovieList.error) {
                let movies = DataService.get('movies');
                movies = movies
                    .map((item, index) => `${index}. ${item.original_title}`)
                    .join(',\n');
                return `The movies are: \n"${movies}"`;
            } else {
                return `Some error occured`;
            }
        },
    },
    WhatMovies: {
        type: StateTypes.Question,
        isIntent: true,
        text: () => 'What movies do you like?',
    },
    GetMovies: {
        type: StateTypes.Statement,
        error: false,
        next: 'Menu',
        retry: 'StartOver',
        before: async () => {
            let genres = DataService.get('genres');
            if (!genres) {
                try {
                    let genreList = await HttpService.getMovieGenres();
                    DataService.set('genres', genreList);
                    MovieMenuState.MovieList.error = false;
                } catch (e) {
                    MovieMenuState.MovieList.error = true;
                }
            }
            HelperService.setSelectedGenre();

            const selectedGenre = DataService.get('selectedGenre');
            const sortBy = DataService.get('sortBy');
            const selectedYear = DataService.get('selectedYear');
            try {
                const movies = await HttpService.getMovieRecommendations(
                    selectedGenre.id,
                    null,
                    sortBy,
                    selectedYear
                );
                DataService.set('movies', movies);
                MovieMenuState.MovieList.error = false;
            } catch (e) {
                MovieMenuState.MovieList.error = true;
            }
        },
        text: () => {
            let movies = DataService.get('movies');
            if (!MovieMenuState.GetMovies.error && movies) {
                movies = movies
                    .map((item, index) => `${index}. ${item.original_title}`)
                    .join(',\n');
                return `The movies are: \n"${movies}"`;
            } else {
                return `Some error occured`;
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
        retry: 'Menu',
        text: () => HelperService.getRandomReply('StartOver'),
        after: (state) => {
            DataService.set('startOver', state.answer);
        },
    },
};
