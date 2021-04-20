import { InfoState, MenuState, MovieMenuState } from './states';

import { StateList } from './models';
import { StateService } from './services';
import { sm } from 'jssm';

const FSM = sm`
Welcome 'next' -> Color 'next' -> Location 'next' -> LikeMovies 'next' -> Menu;
Menu <-> Weather;
Weather 'retry' -> Location;
Menu <-> Genre;
Menu <-> Name;
Menu <-> Colour;
Menu -> Movie;
Movie 'next' -> Genres 'next' -> Actor 'next' -> MovieList;
Genres 'retry' -> StartOver;
Actor 'retry' -> StartOver;
MovieList 'next' -> StartOver 'next' -> Genres;
StartOver 'retry' -> Menu;
Menu -> Goodbye;
`;

// MovieList <-> MoreMovies;
// MoreMovies 'next' -> StartOver 'next' -> Menu;

// LikeMovies 'yes' -> MovieMenu;
// LikeMovies 'no' -> Menu;
// Genre 'next' -> Actor 'next' -> MovieList 'next' -> MoreMovies;
// MoreMovies 'yes' -> Movielist;
// MoreMovies 'no' => StartOver;
// StartOver 'yes' -> MovieMenu;
// StartOver 'no' -> Menu;

const states: StateList = {
    ...InfoState,
    ...MenuState,
    ...MovieMenuState,
};

const StateManager = new StateService(FSM, states);
