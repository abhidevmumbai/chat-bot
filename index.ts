import { sm } from 'jssm';

import { StateTypes } from './enums';
import { StateList } from './models';
import { Data, HttpService, Prompt, StateService } from './services';

const FSM = sm`
Welcome 'next' -> WhatColor 'next' -> WhichLocation 'next' -> Menu;
Menu <-> Weather;
Menu <-> Name;
Menu <-> Colour;
Menu -> Goodbye;
`;

const states: StateList = {
    'Welcome': {
        type: StateTypes.Question,
        text: () => "Welcome to Replicant! I'm a Thinking Machine on a recorded line. Before we begin I'd like to ask you a few questions. First, what is your name?",
        after: (state) => {
            Data.set('name', state.answer);
        }
    },
    'WhatColor': {
        type: StateTypes.Question,
        text: () => "What is your favourite colour?",
        after: (state) => {
            Data.set('colour', state.answer);
        }
    },
    'WhichLocation': {
        type: StateTypes.Question,
        text: () => "Which city/country are you from?",
        after: (state) => {
            Data.set('location', state.answer);
        }
    },
    'Menu': {
        type: StateTypes.Question,
        text: () => "What can I help you with today?",
        choices: ["Name", "Colour", "Weather", "Goodbye"]
    },
    'Name': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const name = Data.get('name');
            return `Your name is ${name}, of course.`
        }
    },
    'Colour': {
        type: StateTypes.Statement,
        next: "Menu",
        text: () => {
            const colour = Data.get('colour');
            return `Your favourite colour is ${colour}, of course.`
        }
    },
    'Weather': {
        type: StateTypes.Statement,
        next: "Menu",
        before: async() => {
            const location = Data.get('location');
            const weather = await HttpService.getWeatherByLocation(location);
            Data.set('temperature', weather);
            return;
        },
        text: () => {
            const temperature = Data.get('temperature');
            const location = Data.get('location');
            return `The weather for ${location} right now is ${temperature} celsius`
        }
    },
    'Goodbye': {
        type: StateTypes.Statement,
        text: () => "Ok. See you.", 
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
}

const StateManager = new StateService(FSM, states);
