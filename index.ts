import { sm } from 'jssm';
import { InfoState, MenuState } from './conversations';
import { StateList } from './models';
import { StateService } from './services';

const FSM = sm`
Welcome 'next' -> WhatColor 'next' -> WhichLocation 'next' -> Menu;
Menu <-> Weather;
Menu <-> Name;
Menu <-> Colour;
Menu -> Goodbye;
`;

const states: StateList = {
    ...InfoState,
    ...MenuState
}

const StateManager = new StateService(FSM, states);
