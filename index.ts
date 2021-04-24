import { InfoState, MenuState, MovieMenuState } from './states';

import { StateList } from './models';
import { StateService } from './services';
import { sm } from 'jssm';

const FSM = sm`
Welcome 'next' => Color 'next' => Location 'next' => Menu;
Menu <-> Weather;
Weather 'retry' -> Location;
Menu <-> Name;
Menu <-> Colour;
Menu => GetMovies;
GetMovies 'next' -> Menu;
GetMovies 'retry' -> StartOver;
Movies 'next' => Genres 'next' => Actor 'next' => MovieList;
Genres 'retry' -> StartOver;
Actor 'retry' -> StartOver;
MovieList 'next' -> StartOver;
StartOver 'next' -> Genres;
StartOver 'retry' -> Menu;
Menu -> Exit;
`;

const states: StateList = {
    ...InfoState,
    ...MenuState,
    ...MovieMenuState,
};

const StateManager = new StateService(FSM, states);
// console.log(IntentService.getIntent('recommend me a flick'));
