import { sm } from 'jssm';
import { StateList } from './models';
import { StateService } from './services';
import { InfoState, MenuState, MovieMenuState } from './states';

const FSM = sm`
Welcome 'next' -> Color 'next' -> Location 'next' -> LikeMovies 'next' -> Menu;
Menu <-> Weather;
Weather 'retry' -> Location;
Menu <-> Genre;
Menu <-> Name;
Menu <-> Colour;
Menu -> Movies;
Movies 'next' -> Genres 'next' -> Actor 'next' -> MovieList;
Genres 'retry' -> StartOver;
Actor 'retry' -> StartOver;
MovieList 'next' -> StartOver 'next' -> Genres;
StartOver 'retry' -> Menu;
Menu -> Goodbye;
`;

const states: StateList = {
    ...InfoState,
    ...MenuState,
    ...MovieMenuState,
};

const StateManager = new StateService(FSM, states);
// console.log(HelperService.getIntent('tell me a flick'));
