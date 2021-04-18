import { sm } from 'jssm';
import { InfoState, MenuState } from './states';
import { StateList } from './models';
import { StateService } from './services';

const FSM = sm`
Welcome 'next' -> Color 'next' -> Location 'next' -> Menu;
Menu <-> Weather;
Menu <-> Name;
Menu <-> Colour;
Menu -> Goodbye;
`;

const states: StateList = {
    ...InfoState,
    ...MenuState,
};

const StateManager = new StateService(FSM, states);
