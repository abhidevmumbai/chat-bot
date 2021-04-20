import { InfoState, MenuState, MovieMenuState } from './states';

import { StateList } from './models';
import { StateService } from './services';
import { sm } from 'jssm';

const FSM = sm`
Welcome 'next' -> Color 'next' -> Location 'next' -> LikeMovies 'next' -> Menu;
Menu <-> Weather;
Menu <-> Genre;
Menu <-> Name;
Menu <-> Colour;
Menu -> Movie 'next' -> Genres;
Genres 'next' -> Actor 'next' -> MovieList 'next' -> MoreMovies;
Menu -> Goodbye;
`;

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
