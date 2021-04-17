import { sm } from 'jssm';
import axios, { AxiosRequestConfig } from 'axios';

import { Prompt } from './services/prompt'
import { Data } from './services/data'
import { StateService } from './services/state'

import { StateTypes, States } from './config/types'

const FSM = sm`
Welcome 'next' -> Authentication 'next' -> Menu;
Menu <-> Weather;
Menu <-> Name;
Menu <-> Colour;
Menu -> Goodbye;
`;

const states: States = {
    'Welcome': {
        type: StateTypes.Question,
        text: () => "Welcome to Replicant! I'm a Thinking Machine on a recorded line. Before we begin I'd like to ask you a few questions. First, what is your name?",
        after: (state) => {
            Data.set('name', state.answer);
        }
    },
    'Authentication': {
        type: StateTypes.Question,
        text: () => "What is your favourite colour?",
        after: (state) => {
            Data.set('colour', state.answer);
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
            const options: AxiosRequestConfig = {
                method: 'GET',
                url: 'https://community-open-weather-map.p.rapidapi.com/weather',
                params: {
                    q: 'Toronto',
                    units: 'metric'
                },
                headers: {
                    'x-rapidapi-key': '17e5d1c9a4msh9626219b27e0824p1a0965jsn0f56fbb373c6',
                    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            const weather = response.data;
            Data.set('temperature', weather.main.temp)
            return;
        },
        text: () => {
            const temperature = Data.get('temperature');
            return `The weather for Toronto right now is ${temperature} celsius`
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
